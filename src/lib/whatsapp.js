// ⚠️ استبدل الرقم التالي برقم واتساب شركتك الفعلي (بالصيغة الدولية، بدون + أو أصفار بالبداية)
const WHATSAPP_NUMBER = '9647763595540';

export function getWhatsappLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}