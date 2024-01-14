import { PrismaClient } from "@prisma/client";
import roleData from "../src/lib/seed/roles.json" with { type: "json" };
import vaccData from "../src/lib/seed/vaccs.json" with { type: "json" };

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding roles...");

  for (const r of Object.keys(roleData.roles)) {
    const user = await prisma.role.upsert({
      where: { id: r },
      update: {},
      create: {
        id: r,
        name: roleData.roles[r].name,
        permissions: roleData.roles[r].permissions,
      },
    });
    console.log(`Created role (id=${user.id})`);
  }

  console.log("Roles seeded.");
  console.log("Seeding vACCs...");

  for (const v of Object.keys(vaccData.vaccs)) {
    const vacc = await prisma.vacc.upsert({
      where: { id: v },
      update: {},
      create: {
        id: v,
        name: vaccData.vaccs[v].name,
        website: vaccData.vaccs[v].website,
        contactEmail: vaccData.vaccs[v].contact_email,
      },
    });
    console.log(`Created vacc (id=${vacc.id})`);
  }

  console.log("vACCs seeded.");
  console.log("Seeding complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
