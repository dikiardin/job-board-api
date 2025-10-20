export function calculateDemographics(allUsers: Array<any>) {
  const ageBuckets: Record<string, number> = {
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0,
    unknown: 0,
  };

  const inc = (key: string) => {
    ageBuckets[key] = (ageBuckets[key] ?? 0) + 1;
  };

  const genderCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();

  const calcAge = (dob?: Date | null): number | null => {
    if (!dob) return null;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  };

  for (const user of allUsers) {
    const gender = user.profile?.gender || user.gender || "Unknown";
    const dob = user.profile?.dob || user.dob;
    const city = user.profile?.city || user.city || "Unknown";

    const age = calcAge(dob);
    if (age == null) inc("unknown");
    else if (age < 25) inc("18-24");
    else if (age < 35) inc("25-34");
    else if (age < 45) inc("35-44");
    else if (age < 55) inc("45-54");
    else inc("55+");

    let normalizedGender = gender.toString().toLowerCase().trim();
    if (normalizedGender === "" || normalizedGender === "null" || normalizedGender === "undefined") {
      normalizedGender = "Unknown";
    } else if (normalizedGender === "m" || normalizedGender === "male" || normalizedGender === "laki-laki") {
      normalizedGender = "Male";
    } else if (normalizedGender === "f" || normalizedGender === "female" || normalizedGender === "perempuan") {
      normalizedGender = "Female";
    } else if (normalizedGender !== "male" && normalizedGender !== "female" && normalizedGender !== "other") {
      normalizedGender = normalizedGender.charAt(0).toUpperCase() + normalizedGender.slice(1);
    }
    genderCounts.set(normalizedGender, (genderCounts.get(normalizedGender) || 0) + 1);
    locationCounts.set(city, (locationCounts.get(city) || 0) + 1);
  }

  const gender = Array.from(genderCounts.entries()).map(([g, count]) => ({ gender: g, count }));
  const locations = Array.from(locationCounts.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);

  return { ageBuckets, gender, locations, totalApplicants: allUsers.length };
}

export function aggregateSalaryTrends(expectedByCityTitle: Array<any>) {
  const byTitle = new Map<string, { sum: number; n: number; min: number; max: number }>();
  for (const row of expectedByCityTitle || []) {
    const cur = byTitle.get(row.title) || { sum: 0, n: 0, min: Number.POSITIVE_INFINITY, max: 0 };
    cur.sum += row.avgExpectedSalary * (row.samples || 1);
    cur.n += (row.samples || 1);
    cur.min = Math.min(cur.min, row.avgExpectedSalary);
    cur.max = Math.max(cur.max, row.avgExpectedSalary);
    byTitle.set(row.title, cur);
  }
  const byPosition = Array.from(byTitle.entries()).map(([position, v]) => ({
    position,
    min: v.min === Number.POSITIVE_INFINITY ? 0 : Math.round(v.min),
    max: Math.round(v.max),
    avg: v.n ? Math.round(v.sum / v.n) : 0,
    count: v.n,
  }));

  const byCity = new Map<string, { sum: number; n: number }>();
  for (const row of expectedByCityTitle || []) {
    const cur = byCity.get(row.city) || { sum: 0, n: 0 };
    cur.sum += row.avgExpectedSalary * (row.samples || 1);
    cur.n += (row.samples || 1);
    byCity.set(row.city, cur);
  }
  const byLocation = Array.from(byCity.entries()).map(([city, v]) => ({ city, avg: v.n ? Math.round(v.sum / v.n) : 0, growth: 0 }));

  return { byPosition, byLocation };
}

export function transformInterests(byCategory: Array<{ category: string; count: number }>) {
  const total = byCategory.reduce((s, x) => s + (x.count || 0), 0) || 1;
  return byCategory.map((x) => ({ category: x.category, applications: x.count, percentage: Math.round((x.count * 100) / total) }));
}


