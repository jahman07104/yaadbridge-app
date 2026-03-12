import { Resend } from 'resend'

const adminEmail = process.env.ADMIN_EMAIL || 'hello@yardbridgeconsulting.com'
const fromAddress = 'YardBridge Consulting <hello@yardbridgeconsulting.com>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not configured')
  return new Resend(key)
}

export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY
}

export async function sendAdminNotification(subject: string, html: string) {
  const resend = getResend()
  await resend.emails.send({ from: fromAddress, to: adminEmail, subject, html })
}

export async function sendClientConfirmation(to: string, subject: string, html: string) {
  const resend = getResend()
  await resend.emails.send({ from: fromAddress, to, subject, html })
}
