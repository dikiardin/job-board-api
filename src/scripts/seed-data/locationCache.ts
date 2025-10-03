import { Prisma, PrismaClient } from "../../generated/prisma";

export async function seedLocationCache(prisma: PrismaClient) {
  await prisma.locationCache.createMany({
    data: [
      {
        city: "Jakarta",
        province: "DKI Jakarta",
        lat: new Prisma.Decimal("-6.2088"),
        lng: new Prisma.Decimal("106.8456"),
        source: "seed",
      },
      {
        city: "Bandung",
        province: "Jawa Barat",
        lat: new Prisma.Decimal("-6.9175"),
        lng: new Prisma.Decimal("107.6191"),
        source: "seed",
      },
      {
        city: "Surabaya",
        province: "Jawa Timur",
        lat: new Prisma.Decimal("-7.2575"),
        lng: new Prisma.Decimal("112.7521"),
        source: "seed",
      },
      {
        city: "Yogyakarta",
        province: "DI Yogyakarta",
        lat: new Prisma.Decimal("-7.7956"),
        lng: new Prisma.Decimal("110.3695"),
        source: "seed",
      },
      {
        city: "Medan",
        province: "Sumatera Utara",
        lat: new Prisma.Decimal("3.5952"),
        lng: new Prisma.Decimal("98.6722"),
        source: "seed",
      },
    ],
    skipDuplicates: true,
  });
}

