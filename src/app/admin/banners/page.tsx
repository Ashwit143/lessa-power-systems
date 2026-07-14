import { Image as ImageIcon, Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { adminListBanners } from "@/services/banner.service";
import { Badge } from "@/components/ui/index";
import Image from "next/image";

export default async function AdminBannersPage() {
  const { data: banners } = await adminListBanners();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Banners</h1>
          <p className="text-neutral-500 mt-1">Manage homepage carousel banners</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-700 rounded-md hover:bg-primary-800 transition-colors gap-2">
            <Plus className="h-4 w-4" />
            Add Banner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {banners && banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-4 py-4 cursor-move">
                      <GripVertical className="h-4 w-4 text-neutral-400" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 h-16 rounded overflow-hidden relative border border-neutral-200 bg-neutral-100 flex-shrink-0">
                        <Image 
                          src={banner.image}
                          alt={banner.headline}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{banner.headline}</div>
                      {banner.subheadline && (
                        <div className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{banner.subheadline}</div>
                      )}
                      <div className="text-xs text-primary-700 mt-1 font-medium">{banner.ctaText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={banner.isActive ? "success" : "neutral"}>
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-neutral-400 hover:text-error transition-colors rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-neutral-300 mb-3" />
                      <p className="font-medium text-neutral-900">No banners found</p>
                      <p className="text-sm mt-1">Add your first banner to display on the homepage.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
