"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  deleteRowAction,
  reorderRowAction,
  toggleFlagAction,
} from "@/app/(admin)/admin/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export type AdminRowSummary = {
  id: string;
  title: string;
  subtitle: string;
  isPublished: boolean;
  featured: boolean | null;
  aiVisible: boolean;
};

type AdminTableProps = {
  table: "projects" | "certifications" | "experiences";
  basePath: string;
  rows: AdminRowSummary[];
};

export function AdminTable({ table, basePath, rows }: AdminTableProps) {
  const t = useTranslations("admin.table");
  const tCommon = useTranslations("common");
  const [pendingDelete, setPendingDelete] = useState<AdminRowSummary | null>(null);
  const [isPending, startTransition] = useTransition();
  const confirmTitleId = useId();

  function runRowAction(
    action: (formData: FormData) => Promise<void>,
    entries: Record<string, string>,
  ) {
    const formData = new FormData();
    formData.set("table", table);
    for (const [key, value] of Object.entries(entries)) {
      formData.set(key, value);
    }
    startTransition(async () => {
      await action(formData);
    });
  }

  if (rows.length === 0) {
    return (
      <p className="border border-line bg-surface px-4 py-8 text-center text-muted">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-surface font-mono text-[11px] uppercase tracking-widest text-muted">
            <th scope="col" className="px-4 py-3">
              #
            </th>
            <th scope="col" className="px-4 py-3">
              {t("status")}
            </th>
            <th scope="col" className="w-full px-4 py-3">
              Item
            </th>
            <th scope="col" className="px-4 py-3">
              {t("featured")}
            </th>
            <th scope="col" className="px-4 py-3">
              {t("aiVisible")}
            </th>
            <th scope="col" className="px-4 py-3">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-line last:border-b-0">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={isPending || index === 0}
                    aria-label={`${t("moveUp")}: ${row.title}`}
                    onClick={() =>
                      runRowAction(reorderRowAction, {
                        id: row.id,
                        direction: "up",
                      })
                    }
                    className="border border-line px-2 py-0.5 text-muted hover:text-ivory disabled:opacity-30 focus-ring"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={isPending || index === rows.length - 1}
                    aria-label={`${t("moveDown")}: ${row.title}`}
                    onClick={() =>
                      runRowAction(reorderRowAction, {
                        id: row.id,
                        direction: "down",
                      })
                    }
                    className="border border-line px-2 py-0.5 text-muted hover:text-ivory disabled:opacity-30 focus-ring"
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    runRowAction(toggleFlagAction, {
                      id: row.id,
                      flag: "is_published",
                      value: String(!row.isPublished),
                    })
                  }
                  className={`border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider focus-ring ${
                    row.isPublished
                      ? "border-blue/60 text-blue-light"
                      : "border-line text-muted"
                  }`}
                >
                  {row.isPublished ? t("published") : t("hidden")}
                </button>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-ivory">{row.title}</p>
                <p className="text-xs text-muted">{row.subtitle}</p>
              </td>
              <td className="px-4 py-3">
                {row.featured === null ? (
                  <span className="text-muted">—</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={row.featured}
                    disabled={isPending}
                    aria-label={`${t("featured")}: ${row.title}`}
                    onChange={() =>
                      runRowAction(toggleFlagAction, {
                        id: row.id,
                        flag: "featured",
                        value: String(!row.featured),
                      })
                    }
                    className="h-4 w-4 accent-[color:var(--antique-brass)] focus-ring"
                  />
                )}
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={row.aiVisible}
                  disabled={isPending}
                  aria-label={`${t("aiVisible")}: ${row.title}`}
                  onChange={() =>
                    runRowAction(toggleFlagAction, {
                      id: row.id,
                      flag: "ai_visible",
                      value: String(!row.aiVisible),
                    })
                  }
                  className="h-4 w-4 accent-[color:var(--blue)] focus-ring"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`${basePath}?edit=${row.id}`}
                    className="border border-line px-3 py-1.5 text-muted hover:text-ivory focus-ring"
                  >
                    {t("edit")}
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setPendingDelete(row)}
                    className="border border-red-900/60 px-3 py-1.5 text-red-300 hover:bg-red-950/40 focus-ring"
                  >
                    {t("delete")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        labelledBy={confirmTitleId}
      >
        <h2 id={confirmTitleId} className="font-display text-2xl text-ivory">
          {t("confirmDeleteTitle")}
        </h2>
        <p className="mt-3 text-sm text-muted">
          {pendingDelete?.title} — {t("confirmDeleteDescription")}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPendingDelete(null)}>
            {tCommon("cancel")}
          </Button>
          <Button
            disabled={isPending}
            onClick={() => {
              if (!pendingDelete) return;
              runRowAction(deleteRowAction, { id: pendingDelete.id });
              setPendingDelete(null);
            }}
            className="border-red-900 bg-red-950 hover:bg-red-900"
          >
            {t("delete")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
