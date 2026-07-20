/**
 * Builds a wa.me URL with a prefilled message. Only the message itself goes
 * into the URL — never e-mail addresses or other personal data beyond what
 * the visitor chose to send.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  const trimmed = message.trim();
  if (trimmed === "") {
    return `https://wa.me/${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(trimmed)}`;
}

export function buildContactWhatsAppMessage(options: {
  template: string;
  name: string;
  category: string;
  message: string;
  maxMessageLength?: number;
}): string {
  const { template, name, category } = options;
  const max = options.maxMessageLength ?? 500;
  const trimmed =
    options.message.length > max
      ? `${options.message.slice(0, max - 1)}…`
      : options.message;

  return template
    .replace("{name}", name)
    .replace("{category}", category)
    .replace("{message}", trimmed);
}
