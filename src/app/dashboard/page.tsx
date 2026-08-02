import { Footer } from "@/components/Footer";
import { DashboardClient } from "@/components/DashboardClient";
import { SiteHeader } from "@/components/SiteHeader";
import { isPremiumUser } from "@/lib/premium";

export default async function DashboardPage() {
  const isPremium = await isPremiumUser();

  return (
    <>
      <SiteHeader isPremium={isPremium} />
      <main className="section-band px-5 py-12 md:px-8 md:py-16">
        <DashboardClient isPremium={isPremium} />
      </main>
      <Footer />
    </>
  );
}
