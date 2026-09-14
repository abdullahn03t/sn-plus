'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚠️ استبدل هذا بإيميلك الفعلي — يجب يطابق الإيميل المسجّل فيه حساب Resend بالضبط
const CONTACT_EMAIL = 'abdullah.n03t@gmail.com';

export async function sendContactEmail(formData) {
  const email = formData.get('email');
  const message = formData.get('message');

  if (!email || !message) {
    return { success: false, error: 'missing' };
  }

  try {
    await resend.emails.send({
      from: 'SN+ Website <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: 'رسالة جديدة من موقع SN+',
      html: `<p><strong>من:</strong> ${email}</p><p><strong>الرسالة:</strong></p><p>${message}</p>`,
    });

    return { success: true };
  } catch {
    return { success: false, error: 'send-failed' };
  }
}