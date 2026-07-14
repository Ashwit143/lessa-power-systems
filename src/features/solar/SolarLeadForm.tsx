"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/forms";
import { Select } from "@/components/ui/forms";
import { SolarLeadFormSchema, type SolarLeadFormInput } from "@/schemas";
import { getSolarEnquiryWhatsAppUrl, openWhatsApp } from "@/utils/whatsapp";
import { analytics } from "@/lib/analytics";

const BILL_RANGE_OPTIONS = [
  { value: "below_1000", label: "Below ₹1,000/month" },
  { value: "1000_3000", label: "₹1,000 – ₹3,000/month" },
  { value: "3000_6000", label: "₹3,000 – ₹6,000/month" },
  { value: "6000_10000", label: "₹6,000 – ₹10,000/month" },
  { value: "above_10000", label: "Above ₹10,000/month" },
];

export function SolarLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SolarLeadFormInput>({
    resolver: zodResolver(SolarLeadFormSchema),
  });

  const onSubmit = async (data: SolarLeadFormInput) => {
    setIsSubmitting(true);

    try {
      // Log lead via Server Action (non-blocking)
      const { submitSolarLead } = await import("./actions");
      await submitSolarLead({ ...data, source: "solar_page" }).catch(() => {
        // Lead logging failure should never block the WhatsApp redirect
      });

      analytics.solarLeadSubmitted(data.monthlyBillRange);

      // Open WhatsApp with pre-filled message
      openWhatsApp(
        getSolarEnquiryWhatsAppUrl({
          name: data.name,
          phone: data.phone,
          monthlyBillRange: data.monthlyBillRange,
        })
      );

      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 bg-white border border-neutral-200 rounded-xl p-6 shadow-card"
      aria-label="Solar enquiry form"
    >
      <Input
        label="Your Name"
        placeholder="Enter your name"
        required
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="WhatsApp / Phone Number"
        placeholder="10-digit mobile number"
        type="tel"
        inputMode="numeric"
        required
        autoComplete="tel"
        error={errors.phone?.message}
        hint="We'll reach you on this number"
        {...register("phone")}
      />

      <Select
        label="Monthly Electricity Bill (approx.)"
        placeholder="Select bill range (optional)"
        options={BILL_RANGE_OPTIONS}
        error={errors.monthlyBillRange?.message}
        {...register("monthlyBillRange")}
      />

      <Button
        type="submit"
        variant="whatsapp"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Opening WhatsApp..."
        leftIcon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
        id="solar-lead-form-submit"
      >
        Get Free Quote on WhatsApp
      </Button>

      <p className="text-xs text-neutral-400 text-center">
        This opens WhatsApp with your details pre-filled.
        <br />
        We don't share your information with third parties.
      </p>
    </form>
  );
}
