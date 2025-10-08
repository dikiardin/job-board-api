import { prisma } from "../../config/prisma";

interface GetAllCompaniesParams {
  page: number;
  limit: number;
  keyword?: string;
  city?: string;
}

type SortField = "name" | "jobsCount";
type SortOrder = "asc" | "desc";

export class GetCompanyRepository {
  public static async getAllCompanies({
    page,
    limit,
    keyword,
    city,
    sort = "name",
    order = "asc",
  }: GetAllCompaniesParams & { sort?: SortField; order?: SortOrder }) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (keyword) where.name = { contains: keyword, mode: "insensitive" };
    if (city) where.locationCity = { contains: city, mode: "insensitive" };

    const companiesRaw = await prisma.company.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        website: true,
        locationCity: true,
        locationProvince: true,
        logoUrl: true,
        bannerUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: { where: { isPublished: true } },
          },
        },
        jobs: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });

    // Count published jobs for sorting
    const companies = companiesRaw.map((c) => ({
      ...c,
      jobsCount: c.jobs.length,
    }));

    companies.sort((a, b) => {
      if (sort === "jobsCount") {
        return order === "asc"
          ? a.jobsCount - b.jobsCount
          : b.jobsCount - a.jobsCount;
      } else {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    const total = await prisma.company.count({ where });

    return { data: companies, total };
  }

  public static async getCompanyBySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        description: true,
        website: true,
        locationCity: true,
        locationProvince: true,
        logoUrl: true,
        bannerUrl: true,
        createdAt: true,
        updatedAt: true,
        jobs: {
          where: { isPublished: true },
          select: {
            id: true,
            slug: true,
            title: true,
            city: true,
            category: true,
            salaryMin: true,
            salaryMax: true,
            tags: true,
            bannerUrl: true,
            applyDeadline: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
