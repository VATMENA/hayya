import { json } from "@sveltejs/kit";
import { API_SUPERKEY } from "$env/static/private";
import prisma from "$lib/prisma";

export async function POST({ request }) {
  if (!request.headers.has("authorization")) {
    return json({}, { status: 403 });
  }

  const key = request.headers.get("authorization")!.split(" ")[1];

  if (key !== API_SUPERKEY) {
    return json({}, { status: 403 });
  }

  const jv = await request.json();

  await prisma.certificate.create({
    data: jv,
  });

  return json({}, { status: 200 });
}
