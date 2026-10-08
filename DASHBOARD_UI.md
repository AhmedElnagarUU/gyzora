# Dashboard UI Extraction

Copy-paste guide to rebuild this dashboard UI in another project.

---

## 1. File Map (source paths)

| Purpose | File path |
|---|---|
| Dashboard root layout | `decoration-demo/src/app/dashboard/layout.tsx` |
| Panel layout (wraps shell) | `decoration-demo/src/app/dashboard/(panel)/layout.tsx` |
| **Main shell (sidebar + topbar + bottom nav)** | `decoration-demo/src/features/dashboard/components/DashboardShell.tsx` |
| Overview page (server) | `decoration-demo/src/app/dashboard/(panel)/page.tsx` |
| Overview page (client/demo) | `decoration-demo/src/features/dashboard/components/DashboardOverviewClient.tsx` |
| Error boundary UI | `decoration-demo/src/app/dashboard/(panel)/error.tsx` |
| Connection status dot | `decoration-demo/src/features/dashboard/components/ConnectionStatusIndicator.tsx` |
| Online hook | `decoration-demo/src/features/dashboard/hooks/useOnlineStatus.ts` |
| Feedback modal + nav button | `decoration-demo/src/features/dashboard/components/FeedbackWidget.tsx` |
| Logo icon | `decoration-demo/src/shared/components/LogoMark.tsx` |
| Button component | `decoration-demo/src/shared/components/Button.tsx` |
| `cn` util | `decoration-demo/src/lib/utils/cn.ts` |
| Theme tokens (colors/fonts) | `decoration-demo/src/app/globals.css` |
| Projects list page UI | `decoration-demo/src/app/dashboard/(panel)/projects/page.tsx` |

Sub-page UIs (same patterns as overview/projects):

- `decoration-demo/src/app/dashboard/(panel)/banners/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/inquiries/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/social/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/privacy/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/pixels/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/security/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/projects/new/page.tsx`
- `decoration-demo/src/app/dashboard/(panel)/projects/[id]/edit/page.tsx`

Manager components: `decoration-demo/src/features/dashboard/<feature>/components/*.tsx`

---

## 2. Dependencies

- Next.js (App Router, `next/link`, `next/navigation`)
- Tailwind CSS v4 (`@import "tailwindcss"`)
- `lucide-react` icons
- Fonts: Inter Variable, DM Sans Variable, Cormorant Garamond (`@fontsource`)

---

## 3. Theme tokens — `src/app/globals.css`

```css
@import "tailwindcss";
@import "@fontsource-variable/inter/wght.css";
@import "@fontsource-variable/dm-sans/wght.css";
@import "@fontsource/cormorant-garamond/latin-400.css";
@import "@fontsource/cormorant-garamond/latin-500.css";
@import "@fontsource/cormorant-garamond/latin-600.css";
@import "@fontsource/cormorant-garamond/latin-700.css";

@theme inline {
  --color-background: #f9f9f9;
  --color-foreground: #1a1a1a;
  --color-muted: #666666;
  --color-accent: #8b6d4d;
  --color-accent-hover: #7a5f42;
  --color-card: #ffffff;
  --color-border: #e5e5e5;

  --font-sans: "DM Sans Variable", system-ui, sans-serif;
  --font-serif: "Cormorant Garamond", Georgia, serif;
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: "Inter Variable", var(--font-sans), system-ui, sans-serif;
  letter-spacing: 0.01em;
}

.font-serif {
  font-family: var(--font-serif), Georgia, serif;
  letter-spacing: -0.02em;
}
```

## 4. `cn` util — `src/lib/utils/cn.ts`

```ts
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

## 5. Logo — `src/shared/components/LogoMark.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils/cn";
import { Armchair } from "lucide-react";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Armchair
      className={cn("h-5 w-5 shrink-0", className)}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
```

## 6. Button — `src/shared/components/Button.tsx`

```tsx
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-300";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    outline: "border border-foreground text-foreground hover:bg-foreground hover:text-white",
    ghost: "text-foreground hover:text-accent",
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
```

---

## 7. Route layouts

### `src/app/dashboard/layout.tsx`

```tsx
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### `src/app/dashboard/(panel)/layout.tsx`

```tsx
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { DashboardTourProvider } from "@/features/dashboard/tour/DashboardTour";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardTourProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardTourProvider>
  );
}
```

> If you don't port the tour, drop `DashboardTourProvider`, `DashboardTourButton`, `startTour`, and the `data-tour` attributes.

---

## 8. Main shell — `src/features/dashboard/components/DashboardShell.tsx`

Layout structure:
- **Mobile**: sticky top bar (logo + status + icons) → slide-in drawer nav → content → fixed bottom icon nav
- **Desktop**: fixed-width `w-64` left sidebar (logo header / nav / footer with status + sign out) + flexible `<main>`

```tsx
"use client";

import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { signOut } from "@/lib/auth/auth-client";
import {
  DashboardTourButton,
  useDashboardTour,
} from "@/features/dashboard/tour/DashboardTour";
import { ConnectionStatusIndicator } from "@/features/dashboard/components/ConnectionStatusIndicator";
import {
  FeedbackNavButton,
  FeedbackProvider,
} from "@/features/dashboard/components/FeedbackWidget";
import { LogoMark } from "@/shared/components/LogoMark";
import {
  Crosshair,
  Eye,
  FolderKanban,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Share2,
  Shield,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const storefrontUrl = `/${routing.defaultLocale}`;

const links = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard, short: "Home" },
  { href: "/dashboard/projects", label: "Projects", Icon: FolderKanban, short: "Projects" },
  { href: "/dashboard/banners", label: "Banners", Icon: Megaphone, short: "Banners" },
  { href: "/dashboard/inquiries", label: "Inquiries", Icon: Inbox, short: "Leads" },
  { href: "/dashboard/social", label: "Social Links", Icon: Share2, short: "Social" },
  { href: "/dashboard/privacy", label: "Privacy Policy", Icon: FileText, short: "Policy" },
  { href: "/dashboard/pixels", label: "Pixels", Icon: Crosshair, short: "Pixels" },
  {
    href: "/dashboard/security",
    label: "Security OTP",
    Icon: Shield,
    short: "OTP",
  },
];

function NavLink({
  href,
  label,
  Icon,
  pathname,
  onNavigate,
  compact,
}: {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
        compact ? "flex-col gap-1 px-2 py-2 text-[10px]" : ""
      } ${
        isActive
          ? compact
            ? "text-accent"
            : "bg-accent text-white"
          : compact
            ? "text-muted"
            : "text-muted hover:bg-background hover:text-foreground"
      }`}
    >
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} strokeWidth={1.75} />
      <span className={compact ? "leading-tight" : ""}>{compact ? label.split(" ")[0] : label}</span>
    </Link>
  );
}

function ViewStorefrontLink({
  className,
  iconClassName = "h-4 w-4",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={storefrontUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="View storefront"
    >
      <Eye className={iconClassName} strokeWidth={1.75} />
    </a>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { startTour } = useDashboardTour();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <FeedbackProvider>
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark className="h-4 w-4" />
          <span className="font-serif text-sm font-semibold tracking-[0.12em] uppercase">
            {SITE_NAME}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ConnectionStatusIndicator compact />
          <ViewStorefrontLink
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            iconClassName="h-5 w-5"
          />
          <button
            type="button"
            onClick={startTour}
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            aria-label="Open dashboard guide"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute top-0 left-0 flex h-full w-72 flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <LogoMark className="h-4 w-4" />
                <span className="font-serif text-sm font-semibold tracking-[0.12em] uppercase">
                  {SITE_NAME}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ViewStorefrontLink
                  className="rounded p-1.5 text-muted hover:bg-background hover:text-foreground"
                  iconClassName="h-5 w-5"
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded p-1 text-muted hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-3" data-tour="tour-nav-sidebar">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  pathname={pathname}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}
              <FeedbackNavButton onNavigate={() => setDrawerOpen(false)} />
            </nav>
            <div className="space-y-1 border-t border-border p-3">
              <ConnectionStatusIndicator />
              <DashboardTourButton />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-2">
              <LogoMark className="h-4 w-4" />
              <span className="font-serif text-sm font-semibold tracking-[0.15em] uppercase">
                {SITE_NAME}
              </span>
            </div>
            <ViewStorefrontLink className="rounded p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground" />
          </div>
          <nav className="flex-1 space-y-1 p-4" data-tour="tour-nav-sidebar">
            {links.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
            <FeedbackNavButton />
          </nav>
          <div className="space-y-1 border-t border-border p-4">
            <ConnectionStatusIndicator />
            <DashboardTourButton />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-card lg:hidden"
        data-tour="tour-nav-mobile"
      >
        <div
          className={`grid ${links.length > 6 ? "grid-cols-7" : links.length > 5 ? "grid-cols-6" : links.length > 4 ? "grid-cols-5" : "grid-cols-4"}`}
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.short}
              Icon={link.Icon}
              pathname={pathname}
              compact
            />
          ))}
        </div>
      </nav>
    </div>
    </FeedbackProvider>
  );
}
```

**Adaptation notes:**
- Replace `routing.defaultLocale` with `"/"` (storefront link).
- Replace `SITE_NAME` with your own constant.
- Replace `signOut` with your auth call.
- Edit the `links` array to your routes (bottom nav grid cols auto-adjust: >6 items → 7 cols, >5 → 6, >5 → 6, >4 → 5, else 4).
- Remove tour/feedback imports if not porting those features.

---

## 9. Connection status — `src/features/dashboard/components/ConnectionStatusIndicator.tsx`

```tsx
"use client";

import { useOnlineStatus } from "@/features/dashboard/hooks/useOnlineStatus";

export function ConnectionStatusIndicator({ compact }: { compact?: boolean }) {
  const isOnline = useOnlineStatus();

  if (isOnline === null) {
    return null;
  }

  const label = isOnline ? "Connected" : "Offline";
  const title = isOnline
    ? "Internet connection is active"
    : "No internet connection";

  return (
    <div
      className={`flex items-center ${compact ? "gap-1.5" : "gap-2 rounded px-3 py-2"}`}
      title={title}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          isOnline
            ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.45)]"
            : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.45)]"
        }`}
        aria-hidden="true"
      />
      {!compact && (
        <span className="text-xs text-muted">{label}</span>
      )}
    </div>
  );
}
```

---

## 10. Overview page UI — `src/app/dashboard/(panel)/page.tsx`

```tsx
import { DashboardOverviewClient } from "@/features/dashboard/components/DashboardOverviewClient";
import { IS_DEMO } from "@/lib/config";
import { data } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projects, inquiries] = await Promise.all([
    data.getProjects(),
    data.getInquiries(),
  ]);

  if (IS_DEMO) {
    return <DashboardOverviewClient seedProjects={projects} seedInquiries={inquiries} />;
  }

  const recent = projects.slice(0, 5);
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    { label: "Total Projects", value: projects.length },
    { label: "Published", value: publishedCount },
    { label: "New Inquiries", value: newInquiries },
    { label: "Total Inquiries", value: inquiries.length },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium sm:text-2xl">Dashboard Overview</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/dashboard/projects/new"
            data-tour="tour-add-project"
            className="bg-accent px-4 py-2.5 text-center text-sm text-white sm:py-2"
          >
            Add Project
          </Link>
          <Link
            href="/dashboard/banners"
            data-tour="tour-manage-banners"
            className="border border-border px-4 py-2.5 text-center text-sm sm:py-2"
          >
            Manage Banners
          </Link>
        </div>
      </div>

      <div
        className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4"
        data-tour="tour-stats-panel"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
            <p className="text-xs text-muted sm:text-sm">{stat.label}</p>
            <p className="mt-1 truncate text-lg font-medium sm:mt-2 sm:text-2xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-sm bg-card shadow-sm" data-tour="tour-recent-projects">
        <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="font-medium">Recent Projects</h2>
        </div>

        {/* Mobile card list */}
        <div className="divide-y divide-border md:hidden">
          {recent.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}/edit`}
              className="block px-4 py-4 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{project.title.en}</p>
                <span
                  className={`shrink-0 px-2 py-0.5 text-[10px] uppercase ${
                    project.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{project.category}</p>
              <p className="mt-1 text-xs text-muted">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((project) => (
                <tr key={project.id} className="border-b border-border">
                  <td className="px-6 py-3">
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="hover:text-accent"
                    >
                      {project.title.en}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{project.category}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs uppercase ${
                        project.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

> The client version (`DashboardOverviewClient.tsx`) is the same JSX with demo hooks; use the server version above and feed it your own data.

---

## 11. Error UI — `src/app/dashboard/(panel)/error.tsx`

```tsx
"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-xl font-medium">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 bg-accent px-6 py-2 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## 12. Reusable UI recipes

**Page header (title + action button)** — used on every dashboard page:

```tsx
<div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-xl font-medium sm:text-2xl">Page Title</h1>
  <Link href="/some/action" className="bg-accent px-4 py-2.5 text-center text-sm text-white sm:py-2">
    Action
  </Link>
</div>
```

**Stat card:**

```tsx
<div className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
  <p className="text-xs text-muted sm:text-sm">Label</p>
  <p className="mt-1 truncate text-lg font-medium sm:mt-2 sm:text-2xl">0</p>
</div>
```

**Status badge:**

```tsx
<span className={`inline-block px-2 py-0.5 text-xs uppercase ${
  status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
}`}>
  {status}
</span>
```

**Card panel with header:**

```tsx
<div className="rounded-sm bg-card shadow-sm">
  <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
    <h2 className="font-medium">Panel Title</h2>
  </div>
  {/* body */}
</div>
```

**Desktop table shell:**

```tsx
<div className="hidden overflow-x-auto rounded-sm bg-card shadow-sm md:block">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-border text-left text-muted">
        <th className="px-6 py-3">Col</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border last:border-0">
        <td className="px-6 py-3">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Mobile card list:**

```tsx
<div className="space-y-3 md:hidden">
  <div className="rounded-sm border border-border bg-card p-4 shadow-sm">...</div>
</div>
```

**Form input / textarea:**

```tsx
className="w-full resize-none border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
```

**Outline button / link:**

```tsx
className="border border-border px-4 py-2.5 text-center text-sm sm:py-2 transition-colors hover:bg-background"
```

**Modal:**

```tsx
<div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
  <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close" />
  <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-sm bg-card p-6 shadow-xl">
    ...
  </div>
</div>
```
