import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import ptMessages from "@/messages/pt.json";
import enMessages from "@/messages/en.json";
import type { Locale } from "@/i18n/routing";

const messages = { pt: ptMessages, en: enMessages };

export function renderWithIntl(
  ui: React.ReactElement,
  { locale = "pt" }: { locale?: Locale } = {},
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}
