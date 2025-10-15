"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSubscriptionExpirationEmail = void 0;
const buildSubscriptionExpirationEmail = (name, planName, expirationDate) => {
    const formattedDate = expirationDate.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    return `
  <body style="margin: 0; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffffff; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header with gradient background -->
            <tr>
              <td style="background: linear-gradient(135deg, #467ec717, #24cfa71b); padding: 30px 0; text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #467EC7, #24CFA7); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #ffffff; font-size: 32px; font-weight: bold;">⏰</span>
                </div>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 40px 50px;">
                <h2 style="color: #222; margin-bottom: 16px;">Hi ${name},</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  Your <strong>${planName}</strong> subscription will expire on <strong>${formattedDate}</strong> (in about 24 hours).
                </p>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  To continue accessing premium features and maintain uninterrupted service, please renew your subscription now:
                </p>

                <div style="text-align: center; margin: 40px 0;">
                  <a href="${process.env.FE_URL || "http://localhost:3000"}/subscription/renew" target="_blank"
                    style="background: #24CFA7; 
                      color: #ffffff; text-decoration: none; 
                      padding: 14px 32px; border-radius: 8px; 
                      font-size: 16px; font-weight: 600;
                      display: inline-block; transition: 0.3s;">
                    Renew Subscription
                  </a>
                </div>

                <p style="color: #777; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
                  <strong>⚠️ Important:</strong> If you don't renew, access to premium features will be disabled after the expiration date.<br>
                  Don't lose access to your valuable subscription benefits!
                </p>

                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                  Best regards,<br>
                  <strong>The Workoo Team</strong>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f4f6f8; text-align: center; padding: 20px;">
                <p style="color: #999; font-size: 13px; margin: 0;">
                  © ${new Date().getFullYear()} Workoo. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
};
exports.buildSubscriptionExpirationEmail = buildSubscriptionExpirationEmail;
//# sourceMappingURL=emailTemplateSubscription.js.map