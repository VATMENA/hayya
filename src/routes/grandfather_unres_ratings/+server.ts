import type { RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import {
  GRANDFATHER_CERTS,
  type PositionV2,
  serialize_position_v2,
} from "$lib/cert";

const should_have_at_s1 = ["AFU-DEL"];

export const GET: RequestHandler = async () => {
  console.log("[UnrestrictedRatings] Unres ratings update task started");

  let users = await prisma.user.findMany({
    include: {
      heldCertificates: true,
    },
  });

  const gf_map = new Map(Object.entries(GRANDFATHER_CERTS));

  for (let user of users) {
    if (user.certificatesAlreadyGrandfathered) continue;
    let rating_short = user.ratingShort;
    let to_grandfather: PositionV2[] = gf_map.get(rating_short)!;
    for (let needed_position of to_grandfather) {
      let has_cert = false;
      let strname = serialize_position_v2(needed_position)!;
      for (let existing_cert of user.heldCertificates) {
        if (existing_cert.position === strname) {
          has_cert = true;
          break;
        }
      }
      console.log(
        `[UnrestrictedRatings] Update ${user.id} ${strname} ${has_cert}`,
      );
      if (has_cert) continue;

      // ratings will not be issued automatically unless they are in a vACC
      if (!user.vaccId) continue;

      await prisma.certificate.create({
        data: {
          holderId: user.id,
          instructorId: "0",
          position: strname,
          instructorComments: "Grandfathered into GCAP rating system",
          issuedInId: user.vaccId,
        },
      });
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        certificatesAlreadyGrandfathered: true,
      },
    });
  }

  return new Response("");
};
