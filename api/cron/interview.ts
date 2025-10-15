import { runInterviewCycle } from "../../src/jobs/interviewJobs";

export default async function handler(req: any, res: any) {
  try {
    await runInterviewCycle();
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
