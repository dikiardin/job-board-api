export function buildInterviewEmail(params: {
  type: "created" | "updated" | "cancelled" | "reminder";
  candidateName: string;
  adminName?: string | null;
  jobTitle: string;
  companyName: string;
  scheduleDate: Date;
  locationOrLink?: string | null;
  notes?: string | null;
}) {
  const { type, candidateName, adminName, jobTitle, companyName, scheduleDate, locationOrLink, notes } = params;
  const titleMap: Record<string, string> = {
    created: "Interview Scheduled",
    updated: "Interview Rescheduled",
    cancelled: "Interview Cancelled",
    reminder: "Interview Reminder (H-1)",
  };

  const dateStr = scheduleDate.toLocaleString();
  const header = titleMap[type];

  return `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>${header} - ${jobTitle} @ ${companyName}</h2>
      <p>Hi ${candidateName},</p>
      <p>
        ${type === "created" ? "You have a new interview scheduled." : ""}
        ${type === "updated" ? "Your interview has been rescheduled." : ""}
        ${type === "cancelled" ? "Your interview has been cancelled." : ""}
        ${type === "reminder" ? "This is a friendly reminder for your upcoming interview." : ""}
      </p>
      <ul>
        <li><strong>Date & Time:</strong> ${dateStr}</li>
        ${locationOrLink ? `<li><strong>Location/Link:</strong> ${locationOrLink}</li>` : ""}
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ""}
      </ul>
      ${adminName ? `<p>Contact person: <strong>${adminName}</strong></p>` : ""}
      <p>Best of luck!<br/>${companyName} Team</p>
    </div>
  `;
}
