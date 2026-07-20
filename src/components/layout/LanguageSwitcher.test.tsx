import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const replaceMock = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/",
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("marks the active locale as pressed", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "pt" });
    expect(screen.getByRole("button", { name: "Português" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Inglês" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("switches to English when EN is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<LanguageSwitcher />, { locale: "pt" });
    await user.click(screen.getByRole("button", { name: "Inglês" }));
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock.mock.calls[0][1]).toEqual({ locale: "en" });
  });

  it("does not navigate when the current locale is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<LanguageSwitcher />, { locale: "pt" });
    await user.click(screen.getByRole("button", { name: "Português" }));
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
