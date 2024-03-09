import type { RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
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

export const GET: RequestHandler = async () => {
  // active = Connections in Vatsim which are active at this moment.
  // open = Connections in DB which were active.

  console.log("[ConnectionUpdater] Connections update task started");

  const req = await fetch("https://data.vatsim.net/v3/vatsim-data.json");

  let datafeed: Datafeed = await req.json();

  const activeConnections = datafeed.controllers.filter((c) => {
    return callsigns.some(([_, r]) => c.callsign.match(r));
  });

  const openConnections = await prisma.connection.findMany({
    where: {
      endTime: null,
    },
  });

  const activeMap: Record<string, Controller> = {};
  const openMap: Record<string, {}> = {};
  activeConnections.forEach((c) => (activeMap[c.cid] = c));
  openConnections.forEach((c) => (openMap[c.userId] = c));

  const closedConnections: Array<string> = [];
  const newConnections: Array<{
    userId: string;
    callsign: string;
    isAuthorized: boolean;
    startTime: Date;
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
      });
      return;
    }

    // If not in activeMap, it no longer exists.
    closedConnections.push(oc.id);
  });

  activeConnections.forEach((ac) => {
    const oc = openConnections[ac.cid];
    if (oc) {
      // Connection exists. Handled above.
      return;
    }

    newConnections.push({
      userId: ac.cid.toString(),
      callsign: ac.callsign,
      isAuthorized: false,
      startTime: ac.logon_time,
    });
  });

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

  await prisma.connection.createMany({
    data: newConnections.map((info) => ({
      id: ulid(),
      userId: info.userId,
      callsign: info.callsign,
      isAuthorized: info.isAuthorized,
      startTime: new Date(),
    })),
  });

  return new Response("");
};

const callsigns = Object.entries({
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
});
