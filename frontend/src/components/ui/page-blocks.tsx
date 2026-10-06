/**
 * Screen scaffolds — the recurring product-screen shapes, built to the
 * finishing rules (app-scale titles, min-width discipline, the three-states
 * rule) so every list/detail/settings screen starts correct instead of
 * hand-rolled. Compose real content into the slots; identity comes from the
 * design tokens, never from forking these.
 *
 *   <ListPage title toolbar loading empty emptyProps pagination> …rows… </ListPage>
 *   <DetailPage title backTo backLabel actions aside> …main… </DetailPage>
 *   <SettingsPage title> <SettingsSection title description> …form… </…> </…>
 *   <StatsRow items={[{label, value, delta?, tone?}]} />
 */
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * List screen: header + toolbar + content + pagination, with loading and
 * empty states wired in (the three-states rule, structurally). `empty` shows
 * the EmptyState INSTEAD of children; `loading` shows skeleton rows.
 */
export function ListPage({
  title,
  description,
  actions,
  toolbar,
  loading = false,
  empty = false,
  emptyProps,
  pagination,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyProps?: {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
  };
  pagination?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-lg-key="4d0f8220ab" className={cn("flex min-w-0 flex-col gap-4", className)}>
      <PageHeader title={title} subtitle={description} actions={actions} />
      {toolbar && (
        <div data-lg-key="1345fb4f7d" className="flex min-w-0 flex-wrap items-center gap-2">{toolbar}</div>
      )}
      {loading ? (
        <div data-lg-key="89cba6b936" className="flex flex-col gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-5/6" />
        </div>
      ) : empty && emptyProps ? (
        <EmptyState {...emptyProps} />
      ) : (
        <div data-lg-key="65235883f0" className="min-w-0">{children}</div>
      )}
      {!loading && !empty && pagination && (
        <div data-lg-key="bc54e28286" className="flex items-center justify-end gap-2">{pagination}</div>
      )}
    </div>
  );
}

/**
 * Detail screen: back link + header + responsive two-column (main + aside).
 * The aside collapses under the main column below lg — no squeeze zone.
 */
export function DetailPage({
  title,
  description,
  backTo,
  backLabel = "Back",
  actions,
  aside,
  children,
  className,
}: {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-lg-key="1f36e92ee9" className={cn("flex min-w-0 flex-col gap-4", className)}>
      {backTo && (
        <Link
          to={backTo}
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      )}
      <PageHeader title={title} subtitle={description} actions={actions} />
      {aside ? (
        <div data-lg-key="80407c5474" className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
          <div data-lg-key="e00ac7b240" className="min-w-0">{children}</div>
          <div data-lg-key="a0b00b8b21" className="min-w-0">{aside}</div>
        </div>
      ) : (
        <div data-lg-key="1c099481c7" className="min-w-0">{children}</div>
      )}
    </div>
  );
}

/** Settings screen: header + stacked SettingsSection rows. */
export function SettingsPage({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-lg-key="1b5a1401a9" className={cn("flex min-w-0 max-w-3xl flex-col gap-6", className)}>
      <PageHeader title={title} subtitle={description} />
      <div data-lg-key="6b05af58bc" className="flex flex-col divide-y">{children}</div>
    </div>
  );
}

/** One settings row: label column + control column, stacking on mobile. */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-lg-key="5e48d6cb87" className={cn("grid min-w-0 gap-3 py-6 first:pt-0 last:pb-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6", className)}>
      <div data-lg-key="6505998d1a" className="min-w-0">
        <h3 data-lg-key="f8b7ebbd94" className="text-sm font-medium">{title}</h3>
        {description && (
          <p data-lg-key="bddb1a6dea" className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      <div data-lg-key="8626878321" className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Stat-tile row: responsive, tabular numerals, contrast-floor compliant.
 * `tone` colors the delta (`up` positive, `down` negative, default neutral).
 */
export function StatsRow({
  items,
  className,
}: {
  items: {
    label: string;
    value: ReactNode;
    delta?: string;
    tone?: "up" | "down" | "neutral";
  }[];
  className?: string;
}) {
  return (
    <div data-lg-key="095874feb1" className={cn("grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <div data-lg-key="69d53e6002" key={item.label} className="bg-card text-card-foreground min-w-0 rounded-lg border p-4">
          <div data-lg-key="08dee792d6" className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {item.label}
          </div>
          <div data-lg-key="7c9e68ecd6" className="mt-1 truncate text-2xl font-semibold tabular-nums">{item.value}</div>
          {item.delta && (
            <div data-lg-key="c1238ea7fe"
              className={cn(
                "mt-1 text-xs tabular-nums",
                item.tone === "up" && "text-emerald-600 dark:text-emerald-400",
                item.tone === "down" && "text-red-600 dark:text-red-400",
                (!item.tone || item.tone === "neutral") && "text-muted-foreground",
              )}
            >
              {item.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
