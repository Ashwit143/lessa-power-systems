// =============================================================================
// Lead Service — Solar enquiry lead capture
// =============================================================================
import type { Lead, ApiResponse } from "@/types";
import type { LeadInput } from "@/schemas";
import { isSupabaseConfigured } from "@/lib/env";

export async function createLead(
  input: LeadInput & { source: Lead["source"] }
): Promise<ApiResponse<Lead>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      phone: input.phone,
      monthly_bill_range: input.monthlyBillRange ?? null,
      message: input.message ?? null,
      source: input.source,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    // Don't block the WhatsApp redirect if lead logging fails
    console.error("[LeadService] Full error:", error);
    return { data: null, error: error.message, success: false };
  }

  // We don't return the inserted lead to avoid RLS SELECT policy violations for anonymous users.
  return { data: null as any, error: null, success: true };
}

export async function adminListLeads(
  status?: Lead["status"],
  limit = 50
): Promise<ApiResponse<Lead[]>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) return { data: null, error: error.message, success: false };
  return { data: (data as Lead[]) ?? [], error: null, success: true };
}

export async function adminUpdateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<ApiResponse<Lead>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message, success: false };
  return { data: data as Lead, error: null, success: true };
}

export async function adminGetLeadStats(): Promise<ApiResponse<{
  total: number;
  new: number;
  contacted: number;
  converted: number;
}>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase.from("leads").select("status");

  if (error) return { data: null, error: error.message, success: false };

  const leads = data as { status: string }[];
  return {
    data: {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      converted: leads.filter((l) => l.status === "converted").length,
    },
    error: null,
    success: true,
  };
}
