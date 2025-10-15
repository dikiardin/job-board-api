"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLocationCache = seedLocationCache;
const prisma_1 = require("../../generated/prisma");
async function seedLocationCache(prisma) {
    await prisma.locationCache.createMany({
        data: [
            {
                city: "Jakarta",
                province: "DKI Jakarta",
                lat: new prisma_1.Prisma.Decimal("-6.2088"),
                lng: new prisma_1.Prisma.Decimal("106.8456"),
                source: "seed",
            },
            {
                city: "Bandung",
                province: "Jawa Barat",
                lat: new prisma_1.Prisma.Decimal("-6.9175"),
                lng: new prisma_1.Prisma.Decimal("107.6191"),
                source: "seed",
            },
            {
                city: "Surabaya",
                province: "Jawa Timur",
                lat: new prisma_1.Prisma.Decimal("-7.2575"),
                lng: new prisma_1.Prisma.Decimal("112.7521"),
                source: "seed",
            },
            {
                city: "Yogyakarta",
                province: "DI Yogyakarta",
                lat: new prisma_1.Prisma.Decimal("-7.7956"),
                lng: new prisma_1.Prisma.Decimal("110.3695"),
                source: "seed",
            },
            {
                city: "Medan",
                province: "Sumatera Utara",
                lat: new prisma_1.Prisma.Decimal("3.5952"),
                lng: new prisma_1.Prisma.Decimal("98.6722"),
                source: "seed",
            },
        ],
        skipDuplicates: true,
    });
}
//# sourceMappingURL=locationCache.js.map