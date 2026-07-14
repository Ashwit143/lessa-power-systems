"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/forms";
import { ContactFormSchema, type ContactFormInput } from "@/schemas";
import { SITE_CONFIG } from "@/lib/config";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

const SUBJECT_OPTIONS = [
  { value: "general_enquiry", label: "General Enquiry" },
  { value: "product_pricing", label: "Product Pricing & Availability" },
  { value: "solar_installation", label: "Solar Installation" },
  { value: "support_warranty", label: "Support & Warranty" },
  { value: "dealership", label: "Dealership Opportunities" },
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would submit to an API route that sends an email
      // and/or logs to Supabase via server action.
      // For now, we'll log it as a lead if it's product/solar related.
      const { submitContactLead } = await import("./actions");
      
      const response = await submitContactLead(data);

      if (!response.success) {
        toast.error(response.error || "Failed to send message.");
        setIsSubmitting(false);
        return;
      }

      analytics.event({ name: "contact_form_submitted", properties: { subject: data.subject } });
      
      toast.success("Message sent successfully. We'll be in touch soon!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again or contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone Number"
          placeholder="10-digit mobile number"
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <Input
        label="Email Address (Optional)"
        placeholder="your.email@example.com"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Select
        label="Subject"
        placeholder="Select a subject"
        required
        options={SUBJECT_OPTIONS}
        error={errors.subject?.message}
        {...register("subject")}
      />

      <Textarea
        label="Message"
        placeholder="How can we help you?"
        required
        rows={4}
        error={errors.message?.message}
        {...register("message")}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        leftIcon={<Send className="h-4 w-4" aria-hidden="true" />}
      >
        Send Message
      </Button>
      
      <p className="text-xs text-neutral-500 text-center mt-3">
        For faster response, you can also reach us directly via WhatsApp or Phone.
      </p>
    </form>
  );
}
