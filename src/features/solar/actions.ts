"use server";

import { SolarLeadFormSchema, type LeadInput } from "@/schemas";
import type { ApiResponse, Lead } from "@/types";

export async function submitSolarLead(
  data: LeadInput & { source: Lead["source"] }
): Promise<ApiResponse<Lead>> {
  // Validate data server-side
  const parsed = SolarLeadFormSchema.safeParse(data);
  if (!parsed.success) {
    return { data: null, error: "Validation failed on the server. Please check your inputs.", success: false };
  }

  const { createLead } = await import("@/services/lead.service");
  return createLead({
    name: parsed.data.name,
    phone: parsed.data.phone,
    monthlyBillRange: parsed.data.monthlyBillRange,
    source: data.source, // Keep the source from the initial payload
  });
}
