import { Resend } from "resend";
import { LocaleData } from "~/locales";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function sendVerificationEmail({
  email,
  code,
  t,
}: {
  email: string;
  code: string;
  t: LocaleData;
}) {
  return resend.emails.send({
    from: `Wishub App <onboarding@${process.env.DOMAIN}>`,
    to: email,
    subject: `${t.emails.confirm_email.title} Wishub`,
    html: `<p>${t.emails.confirm_email.comment}</p><p>${code}</p>`,
    // Set this to prevent Gmail from threading emails.
    // More info: https://resend.com/changelog/custom-email-headers
    headers: headers(),
  });
}

export function sendPasswordResetToken({
  email,
  link,
  t,
}: {
  email: string;
  link: string;
  t: LocaleData;
}) {
  return resend.emails.send({
    from: `Wishub App <onboarding@${process.env.DOMAIN}>`,
    to: email,
    subject: `${t.emails.reset_password.title}`,
    // react: ResetPasswordTemplate({
    //   link,
    //   t,
    // }),
    html: `<p>Click <a href="${link}">here</a> to reset your password</p>`,
    // Set this to prevent Gmail from threading emails.
    // More info: https://resend.com/changelog/custom-email-headers
    headers: headers(),
  });
}

function headers() {
  return { "X-Entity-Ref-ID": new Date().getTime() + "" };
}
