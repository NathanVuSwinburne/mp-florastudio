import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  withFooter = true,
}: {
  children: React.ReactNode;
  className?: string;
  withFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      {withFooter && <SiteFooter />}
    </div>
  );
}
