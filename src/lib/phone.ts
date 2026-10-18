/** Accepts 03001234567, 0300-1234567, +92 300 1234567, 923001234567 → returns +923001234567 */
export function normalisePkPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, '').replace(/^\+/, '');
  let local = '';
  if (/^03\d{9}$/.test(digits)) local = digits.slice(1);
  else if (/^923\d{9}$/.test(digits)) local = digits.slice(2);
  else if (/^3\d{9}$/.test(digits)) local = digits;
  else return null;
  return `+92${local}`;
}

/** +923001234567 or 03001234567 → 0300 1234567 */
export function formatPkPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const e164 = normalisePkPhone(phone) ?? phone;
  const m = e164.match(/^\+92(3\d{2})(\d{7})$/);
  return m ? `0${m[1]} ${m[2]}` : phone;
}

/** WhatsApp link for a Pakistani number, optionally with a pre-filled message. */
export function whatsappLink(e164: string | null | undefined, text?: string): string | null {
  if (!e164) return null;
  const n = (normalisePkPhone(e164) ?? e164).replace(/[^\d]/g, '');
  if (n.length < 10) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
