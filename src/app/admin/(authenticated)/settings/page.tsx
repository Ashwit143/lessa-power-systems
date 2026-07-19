import { getSiteSettings } from "@/services/settings.service";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage store settings and configurations</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
