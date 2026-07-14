import { MessageSquare, Download, Filter } from "lucide-react";
import { adminListLeads } from "@/services/lead.service";
import { Badge } from "@/components/ui/index";

export default async function AdminLeadsPage() {
  const { data: leads } = await adminListLeads();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>
          <p className="text-neutral-500 mt-1">Manage customer inquiries and solar requests</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Filters/Search bar */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50">
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white hover:bg-neutral-50">
              <Filter className="h-4 w-4 text-neutral-500" />
              Filter
            </button>
            <select className="border border-neutral-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {leads && leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{lead.name}</div>
                      <div className="text-neutral-500">{lead.phone}</div>
                      {lead.monthlyBillRange && (
                        <div className="text-xs text-neutral-400 mt-1">Bill: {lead.monthlyBillRange.replace('_', ' ')}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-neutral-600 bg-neutral-100 px-2 py-1 rounded text-xs font-medium">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={lead.status === "new" ? "accent" : "neutral"}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare className="h-10 w-10 text-neutral-300 mb-3" />
                      <p className="font-medium text-neutral-900">No leads found</p>
                      <p className="text-sm mt-1">Inquiries from the website will appear here.</p>
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
