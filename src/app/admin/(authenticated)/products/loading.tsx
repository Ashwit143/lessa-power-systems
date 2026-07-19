import { Search, Plus } from "lucide-react";

export default function LoadingProducts() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="h-8 w-32 bg-neutral-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-neutral-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-neutral-200 rounded-md"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50">
          <div className="relative w-full sm:w-72 h-10 bg-neutral-200 rounded-md"></div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="h-10 w-32 bg-neutral-200 rounded-md"></div>
            <div className="h-10 w-32 bg-neutral-200 rounded-md"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-neutral-200 flex-shrink-0"></div>
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-48 bg-neutral-200 rounded"></div>
                        <div className="h-3 w-24 bg-neutral-200 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-neutral-200 rounded-full"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-12 bg-neutral-200 rounded ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
