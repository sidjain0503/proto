import { MarketingHeader } from "@/components/shell/MarketingHeader";
import { MarketingFooter } from "@/components/shell/MarketingFooter";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
