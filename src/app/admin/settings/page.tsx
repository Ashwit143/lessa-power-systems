import { Settings, Building, Tags, Save } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { Input, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage store settings and configurations</p>
      </div>

      <div className="space-y-8">
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
                label="Business Name" 
                defaultValue={SITE_CONFIG.businessName} 
              />
              <Input 
                label="Primary Phone" 
                defaultValue={SITE_CONFIG.primaryPhone} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="WhatsApp Number" 
                defaultValue={SITE_CONFIG.whatsappNumber} 
              />
              <Input 
                label="Email Address" 
                defaultValue={SITE_CONFIG.email} 
              />
            </div>
            <Textarea 
              label="Address Line 1" 
              defaultValue={SITE_CONFIG.address.line1} 
              rows={2}
            />
          </div>
        </div>

        {/* Categories (Placeholder) */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Tags className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
              <p className="text-sm text-neutral-500">Manage product categories.</p>
            </div>
          </div>
          <div className="p-6 text-center text-neutral-500 py-12">
            Category management is configured via code in this version.
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
