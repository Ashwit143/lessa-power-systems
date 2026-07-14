"use server";

import { ContactFormSchema, type ContactFormInput } from "@/schemas";
import type { ApiResponse, Lead } from "@/types";

export async function submitContactLead(
  data: ContactFormInput
): Promise<ApiResponse<Lead>> {
  // Validate data server-side
  const parsed = ContactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { data: null, error: "Validation failed on the server. Please check your inputs.", success: false };
  }

  const { createLead } = await import("@/services/lead.service");
  return createLead({
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: `Subject: ${parsed.data.subject}\nEmail: ${parsed.data.email || 'Not provided'}\n\n${parsed.data.message}`,
    source: "contact_form",
  });
}
