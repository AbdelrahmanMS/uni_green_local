import type { ReactNode } from "react";
import { Button, Spinner } from "./ui";
import { errorMessage } from "../lib/http";
import { ar } from "../lib/i18n";

/**
 * Shared loading / error / empty wrapper for React Query results.
 * Keeps every screen's async UX consistent.
 */
export function QueryState<T>({
  isLoading,
  isError,
  error,
  data,
  isEmpty,
  onRetry,
  emptyText = ar.empty,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data: T | undefined;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  emptyText?: string;
  children: (data: T) => ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-muted">
        <Spinner />
        <span>{ar.loading}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-sm text-danger">{errorMessage(error)}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {ar.retry}
          </Button>
        )}
      </div>
    );
  }

  if (data === undefined) return null;

  if (isEmpty && isEmpty(data)) {
    return <div className="py-16 text-center text-muted">{emptyText}</div>;
  }

  return <>{children(data)}</>;
}
