import { FACILITIES, parse_position_v2, RATINGS } from "$lib/cert";
import prisma from "$lib/prisma";
import type { Certificate } from "@prisma/client";
import { ulid } from "ulid";

interface Datafeed {
  controllers: Controller[];
}

interface Controller {
  cid: number;
  name: string;
  callsign: string;
  frequency: string;
  facility: number;
  rating: number;
  server: string;
  visual_range: number;
  last_updated: Date;
  logon_time: Date;
}

export const connectionsCron = async () => {
  // active = Connections in Vatsim which are active at this moment.
  // open = Connections in DB which were active.

  console.log("[ConnectionUpdater] Connections update task started");

  const req = await fetch("https://data.vatsim.net/v3/vatsim-data.json");

  const datafeed: Datafeed = await req.json();

  const activeConnections = datafeed.controllers.filter((c) => {
    return Object.entries(callsigns).some(([_, r]) => c.callsign.match(r));
  });

  const openConnections = await prisma.connection.findMany({
    where: {
      endTime: null,
    },
  });

  const activeMap: Record<string, Controller> = {};
  const openMap: Record<string, object> = {};
  activeConnections.forEach((c) => (activeMap[c.cid.toString()] = c));
  openConnections.forEach((c) => (openMap[c.userId] = c));

  console.log(
    `[ConnectionUpdater] Vatsim Connections: ${activeConnections.length} | DB Connections: ${openConnections.length}`,
  );

  const closedConnections: Array<string> = [];
  const newConnections: Array<{
    userId: string;
    callsign: string;
    isAuthorized: boolean;
    startTime: Date;
    facility: number;
    // Fields used for creating new unknown users.
    name: string;
    rating: number;
  }> = [];

  // Collect changed callsigns and closed connections.
  openConnections.forEach((oc) => {
    const ac = activeMap[oc.userId];
    if (ac) {
      // If they swapped callsigns, close the old connection and open a new one.
      if (ac.callsign === oc.callsign) {
        return;
      }

      closedConnections.push(oc.id);
      newConnections.push({
        userId: ac.cid.toString(),
        callsign: ac.callsign,
        isAuthorized: false,
        startTime: ac.logon_time,
        facility: ac.facility,
        name: ac.name,
        rating: ac.rating,
      });
      return;
    }

    // If not in activeMap, it no longer exists.
    closedConnections.push(oc.id);
  });

  activeConnections.forEach((ac) => {
    const oc = openMap[ac.cid.toString()];
    if (oc) {
      // Connection exists. Handled above.
      return;
    }

    newConnections.push({
      userId: ac.cid.toString(),
      callsign: ac.callsign,
      isAuthorized: false,
      startTime: ac.logon_time,
      facility: ac.facility,
      name: ac.name,
      rating: ac.rating,
    });
  });

  console.log(
    `[ConnectionUpdater] New Connections: ${newConnections.length} | Closed Connections: ${closedConnections.length}`,
  );

  if (closedConnections.length) {
    await prisma.connection.updateMany({
      where: {
        id: {
          in: closedConnections,
        },
      },
      data: {
        endTime: new Date(),
      },
    });
  }

  // Create any unknown potential users.
  const activeUsers = await prisma.user.findMany({
    where: {
      id: {
        in: newConnections.map((info) => info.userId),
      },
    },
  });

  const userMap: Record<string, boolean> = {};
  activeUsers.forEach((u) => {
    userMap[u.id] = true;
  });

  const newUsers = newConnections.filter((info) => !userMap[info.userId]);
  if (newUsers.length) {
    console.log(
      `[ConnectionUpdater] Unknown User Connections: ${newUsers.length}`,
    );
    await prisma.user.createMany({
      data: newUsers.map((u) => ({
        id: u.userId,
        name: u.name,
        ratingId: u.rating,
        ratingShort: RATINGS[u.rating][0],
        ratingLong: RATINGS[u.rating][1],
        region: "",
        division: "",
      })),
    });
  }

  const insufficientRating = newConnections.filter((info, i) => {
    let ok = false;
    switch (FACILITIES[info.facility][0]) {
      case "DEL":
      case "GND":
        if (info.rating >= ratingID("S1")) {
          ok = true;
        }
        break;
      case "TWR":
        if (info.rating >= ratingID("S2")) {
          ok = true;
        }
        break;
      case "APP":
        if (info.rating >= ratingID("S3")) {
          ok = true;
        }
        break;
      case "FSS":
      case "CTR":
        if (info.rating >= ratingID("C1")) {
          ok = true;
        }
        break;
    }
    // Authorized from rating. No need to check certificates.
    if (ok) {
      newConnections[i].isAuthorized = true;
    }
    return !ok;
  });

  const certs = await prisma.certificate.findMany({
    where: {
      holderId: {
        in: insufficientRating.map((info) => info.userId),
      },
      OR: [
        // Non-expired and permanent certificates.
        { expires: { lt: new Date() } },
        { expires: null },
      ],
    },
  });

  const certMap: Record<string, Certificate[]> = {};
  certs.forEach((c) => {
    if (!certMap[c.holderId]) certMap[c.holderId] = [];
    certMap[c.holderId].push(c);
  });

  newConnections.forEach((info, i) => {
    const certs = certMap[info.userId];
    if (info.isAuthorized || !certs) return;
    certs.forEach((c) => {
      const pos = parse_position_v2(c.position);
      if (!pos) return;

      // Check to match callsign with certificate facility.
      if (pos.facility && pos.facility in callsigns) {
        const re = (callsigns as any)[pos.facility];
        if (!info.callsign.match(re)) return;
      }

      if (FACILITIES[info.facility][0] === pos.position) {
        newConnections[i].isAuthorized = true;
      }
    });
  });

  if (newConnections.length) {
    await prisma.connection.createMany({
      data: newConnections.map((info) => ({
        id: ulid(),
        userId: info.userId,
        callsign: info.callsign,
        isAuthorized: info.isAuthorized,
        startTime: info.startTime,
      })),
    });
  }
};

const callsigns = {
  HECC: /(^HE[A-Z]{2}_.+$)/,
  OJAC: /(^OJ[A-Z]{2}_.+$)|(^AMM_APP$)/,
  OMAE: /(^OM[A-Z]{2}_.+$)/,
  OBBB: /(^OB[A-Z]{2}_.+$)/,
  OTDF: /(^DOH_(?:._|)APP$)|(^OT[A-Z]{2}_.+$)/,
  OKAC: /(^OK[A-Z]{2}_.+$)/,
  ORBB: /(^OR[A-Z]{2}_.+$)/,
  OIIX: /(^OI[A-Z]{2}_.+$)|(^TEH_.+$)/,
  OSTT: /(^OS[A-Z]{2}_.+$)/,
  OOMM: /(^OO[A-Z]{2}_.+$)/,
  OYSC: /(^OY[A-Z]{2}_.+$)/,
  OEJD: /(^OE[A-Z]{2}_.+$)/,
  OLBB: /(^OL[A-Z]{2}_.+$)/,
  GULF: /^GULF_(E_|W_|)FSS$/,
  AFR: /^AFR(N|E|)_FSS$/,
  MENA: /^MENA_(E_|W_|S_|C_)FSS$/,

  HLLL: /(^HL[A-Z]{2}_.+$)/,
  HSSS: /(^HS[A-Z]{2}_.+$)/,
  HAAA: /(^HA[A-Z]{2}_.+$)/,
  HHAA: /(^HH[A-Z]{2}_.+$)/,
  HCSM: /(^HC[A-Z]{2}_.+$)/,
  DTTC: /(^DT[A-Z]{2}_.+$)/,
  DAAA: /(^DA[A-Z]{2}_.+$)/,
  FTTT: /(^FT[A-Z]{2}_.+$)/,
  DRRR: /(^DR[A-Z]{2}_.+$)/,
  GMMM: /(^GM[A-Z]{2}_.+$)/,

  staff_VATMENA: /(^VATMENA.+$)/,
  staff_HECC: /(^ACCEG\d+$)/,
  staff_OJAC: /(^ACCJO\d+$)/,
  staff_OMAE: /(^ACCAE\d+$)/,
  staff_OBBB: /(^ACCBH\d+$)/,
  staff_OKAC: /(^ACCKWIQ\d+$)/,
  staff_OIIX: /(^ACCIR\d+$)/,
  staff_OSTT: /(^ACCSY\d+$)/,
  staff_OOMM: /(^ACCOM\d+$)/,
  staff_OYSC: /(^ACCYE\d+$)/,
  staff_OEJN: /(^ACCSA\d+$)/,
  staff_OLBB: /(^ACCLB\d+$)/,
};

const ratingID = (name: string) => RATINGS.findIndex((r) => r[0] === name);
