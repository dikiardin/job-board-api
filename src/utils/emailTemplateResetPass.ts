export function buildResetPasswordEmail(name: string, token: string) {

  return `
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
      <tr>
        <td>
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            You requested to reset your password. Click the link below to set a new one:
          </p>
          <div style="display: inline-block;">
            <div style="text-align: center; margin: 30px 0;">
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; display: inline-block; background-color: #f9f9f9;">
                <p style="text-align: center; margin: 0 0 15px 0;">
                  <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}" target="_blank" 
                    style="background-color: #000000ff; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                    Reset Password
                  </a>
                </p>
                <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
                  This link will expire in <strong>15 minutes</strong>.
                </p>
              </div>
            </div>  
          </div>
          <p style="color: #888; font-size: 14px;">
            If you didn't request this, you can safely ignore this email.
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
}
