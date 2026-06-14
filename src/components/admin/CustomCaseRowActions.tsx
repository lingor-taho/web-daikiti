"use client";

import type { FormEvent } from "react";
import Link from "next/link";

type CustomCaseRowActionsProps = {
  customCaseId: number;
  deleteAction: () => Promise<void>;
  editHref: string;
  previewHref: string;
  title: string;
  unpublishAction: () => Promise<void>;
};

export function getCustomCaseDeleteConfirmationMessage(title: string) {
  return `${title}を完全に削除します。この操作は取り消せません。`;
}

export function shouldDeleteCustomCase(
  title: string,
  confirmAction: (message: string) => boolean = window.confirm,
) {
  return confirmAction(getCustomCaseDeleteConfirmationMessage(title));
}

export function CustomCaseRowActions({
  customCaseId,
  deleteAction,
  editHref,
  previewHref,
  title,
  unpublishAction,
}: CustomCaseRowActionsProps) {
  function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    if (!shouldDeleteCustomCase(title)) {
      event.preventDefault();
    }
  }

  return (
    <div className="admin-row-actions" aria-label={`${title}の操作`} role="group">
      <Link
        aria-label={`${title}を編集`}
        className="admin-button admin-button--secondary admin-button--compact"
        href={editHref}
      >
        編集
      </Link>
      <Link
        aria-label={`${title}をプレビュー`}
        className="admin-button admin-button--secondary admin-button--compact"
        href={previewHref}
      >
        プレビュー
      </Link>
      <form action={unpublishAction}>
        <button
          aria-label={`${title}を下書きに戻す`}
          className="admin-button admin-button--secondary admin-button--compact"
          type="submit"
        >
          下書きに戻す
        </button>
      </form>
      <form action={deleteAction} onSubmit={handleDeleteSubmit}>
        <button
          aria-describedby={`custom-case-delete-confirmation-${customCaseId}`}
          aria-label={`${title}を完全に削除`}
          className="admin-button admin-button--danger admin-button--compact"
          type="submit"
        >
          削除
        </button>
        <span className="sr-only" id={`custom-case-delete-confirmation-${customCaseId}`}>
          削除前に確認ダイアログが表示されます。
        </span>
      </form>
    </div>
  );
}
