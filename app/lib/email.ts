import { ConfirmEmailTemplate } from "emails/confirm-email";
import { ResetPasswordTemplate } from "emails/reset-password";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function sendVerificationEmail(email: string, code: string) {
  return resend.emails.send({
    from: `Wishub App <onboarding@${process.env.DOMAIN}>`,
    to: email,
    subject: "Confirm your account",
    react: ConfirmEmailTemplate({
      code,
    }),
    // Set this to prevent Gmail from threading emails.
    // More info: https://resend.com/changelog/custom-email-headers
    headers: headers(),
  });
}

export function sendPasswordResetToken(email: string, link: string) {
  return resend.emails.send({
    from: `Wishub App <onboarding@${process.env.DOMAIN}>`,
    to: email,
    subject: "Reset your password",
    react: ResetPasswordTemplate({
      link,
    }),
    // Set this to prevent Gmail from threading emails.
    // More info: https://resend.com/changelog/custom-email-headers
    headers: headers(),
  });
}

function headers() {
  return { "X-Entity-Ref-ID": new Date().getTime() + "" };
}
