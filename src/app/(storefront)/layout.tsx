import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/common/WhatsAppFAB";
import { getSiteSettings } from "@/services/settings.service";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  
  return (
    <>
      <Navbar settings={settings} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppFAB settings={settings} />
    </>
  );
}
