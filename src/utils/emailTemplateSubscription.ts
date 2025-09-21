export const buildSubscriptionExpirationEmail = (
  name: string,
  planName: string,
  expirationDate: Date
) => {
  const formattedDate = expirationDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
        <tr>
          <td>
            <h2 style="color: #333;">Hi ${name},</h2>
                   <p style="color: #555; font-size: 16px; line-height: 1.5;">
                     Your <strong>${planName}</strong> subscription will expire on <strong>${formattedDate}</strong> (2 minutes from now).
                   </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              To continue accessing premium features, please renew your subscription now.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FE_URL}/subscription/renew" target="_blank" 
                style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Renew Subscription
              </a>
            </div>
            <p style="color: #888; font-size: 14px;">
              If you don't renew, access to premium features will be disabled after the expiration date.
            </p>
            <p style="color: #555; font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              Workoo Team
            </p>
          </td>
        </tr>
      </table>
    </body>
    `;
};
