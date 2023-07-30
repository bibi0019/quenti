import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { env } from "../env/server.mjs";
import ConfirmCodeEmail, {
  type ConfirmCodeEmailProps,
} from "./templates/confirm-code";
import {
  OrganizationInviteEmail,
  type OrganizationInviteEmailProps,
} from "./templates/organization-invite";

const NOTIFICATIONS_SENDER = `notifications@${env.EMAIL_SENDER || ""}`;

const to = (email: string | string[]) => {
  if (env.USE_RESEND_PREVIEWS) return "delivered@resend.dev";
  return email;
};

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export const sendEmail = async (opts: CreateEmailOptions) => {
  if (!resend) {
    console.warn("Resend not configured, skipping email send");
    return;
  }
  await resend.sendEmail({ ...opts, to: to(opts.to) });
};

export const sendOrganizationInviteEmail = async (
  email: string,
  opts: OrganizationInviteEmailProps
) => {
  await sendEmail({
    from: NOTIFICATIONS_SENDER,
    to: email,
    subject: `You've been invited to ${opts.orgName}`,
    react: OrganizationInviteEmail(opts),
  });
};

export const sendConfirmCodeEmail = async (
  email: string,
  opts: ConfirmCodeEmailProps
) => {
  await sendEmail({
    from: NOTIFICATIONS_SENDER,
    to: email,
    subject: `Verify ${opts.orgName}`,
    react: ConfirmCodeEmail(opts),
  });
};
