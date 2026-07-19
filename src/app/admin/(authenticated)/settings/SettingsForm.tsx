"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Save } from "lucide-react";
import { Input, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/Button";
import { saveSettingsAction } from "../../actions";
import type { AppSettings, SettingsUpdatePayload } from "@/services/settings.service";

interface SettingsFormProps {
  initialSettings: AppSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SettingsUpdatePayload>({
    companyName: initialSettings.companyName,
    companyLogo: initialSettings.companyLogo,
    primaryPhone: initialSettings.primaryPhone,
    whatsappNumber: initialSettings.whatsappNumber,
    email: initialSettings.email,
    address: initialSettings.address,
    workingHours: initialSettings.workingHours,
    googleMapsLink: initialSettings.googleMapsLink,
  });

  const handleChange = (field: keyof SettingsUpdatePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await saveSettingsAction(formData);

      if (result.success) {
        setSuccessMsg("Settings saved successfully.");
        // Refresh the route so server components pick up new cached data
        router.refresh();
      } else {
        setError(result.error || "Failed to save settings.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      // clear success msg after 3s
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm font-medium">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Business Info */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Building className="h-5 w-5 text-primary-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Business Information</h2>
            <p className="text-sm text-neutral-500">Update your company details and contact info.</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Company Name" 
              value={formData.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
            />
            <Input 
              label="Company Logo URL" 
              value={formData.companyLogo || ""}
              onChange={(e) => handleChange("companyLogo", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Primary Phone" 
              value={formData.primaryPhone || ""}
              onChange={(e) => handleChange("primaryPhone", e.target.value)}
              required
            />
            <Input 
              label="WhatsApp Number" 
              value={formData.whatsappNumber || ""}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Email Address" 
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            <Input 
              label="Working Hours" 
              value={formData.workingHours || ""}
              onChange={(e) => handleChange("workingHours", e.target.value)}
              placeholder="e.g., Mon - Sat: 10:00 AM - 8:30 PM"
            />
          </div>
          
          <Textarea 
            label="Full Address" 
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={3}
            required
          />

          <Input 
            label="Google Maps Link" 
            value={formData.googleMapsLink || ""}
            onChange={(e) => handleChange("googleMapsLink", e.target.value)}
            placeholder="https://g.page/..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          isLoading={isLoading} 
          loadingText="Saving..."
          leftIcon={!isLoading && <Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
