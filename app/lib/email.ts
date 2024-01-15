import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function sendVerificationEmail(email: string, code: string) {
  return resend.emails.send({
    from: "Wishlist App <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your account",
    html: `
      <h1>Confirm your account</h1>
      <p>Enter this code to confirm your account: <strong>${code}</strong></p>
    `,
    // Set this to prevent Gmail from threading emails.
    // More info: https://resend.com/changelog/custom-email-headers
    headers: {
      "X-Entity-Ref-ID": new Date().getTime() + "",
    },
  });
}
