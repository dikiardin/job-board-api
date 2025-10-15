import { runSubscriptionCycle } from "../../src/jobs/subscriptionJobs";

export default async function handler(req: any, res: any) {
  try {
    await runSubscriptionCycle();
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
