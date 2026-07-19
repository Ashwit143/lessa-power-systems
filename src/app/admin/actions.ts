"use server";

import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminGetProductById } from "@/services/product.service";
import type { Product } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import type { SettingsUpdatePayload } from "@/services/settings.service";

export async function uploadImageAction(base64Data: string, fileName: string) {
  try {
    const supabase = await createClient();
    
    // Remove data URI prefix if exists
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true
      });
      
    if (error) return { success: false, error: error.message };
    
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    return { success: true, data: publicUrlData.publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload image" };
  }
}

export async function createProductAction(productData: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return await adminCreateProduct(productData);
}

export async function updateProductAction(id: string, updates: Partial<Product>) {
  return await adminUpdateProduct(id, updates);
}

export async function deleteProductAction(id: string) {
  // First get the product to find the featuredImage URL
  const productRes = await adminGetProductById(id);
  
  if (productRes.success && productRes.data?.featuredImage) {
    const imageUrl = productRes.data.featuredImage;
    // Try to extract the path from the URL if it's a Supabase storage URL
    // Format: https://[projectId].supabase.co/storage/v1/object/public/products/[filename]
    try {
      if (imageUrl.includes('/storage/v1/object/public/products/')) {
        const urlObj = new URL(imageUrl);
        const pathParts = urlObj.pathname.split('/products/');
        if (pathParts.length > 1) {
          const fileName = decodeURIComponent(pathParts[1]);
          
          const supabase = await createClient();
          const { error: storageError } = await supabase.storage
            .from('products')
            .remove([fileName]);
            
          if (storageError) {
            console.error("Failed to delete image from storage:", storageError);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse image URL for deletion:", e);
    }
  }

  return await adminDeleteProduct(id);
}

export async function saveSettingsAction(payload: SettingsUpdatePayload) {
  try {
    const supabase = await createClient();
    
    // Map camelCase to snake_case for DB
    const dbPayload = {
      id: 1, // Ensure single row
      company_name: payload.companyName,
      company_logo: payload.companyLogo,
      primary_phone: payload.primaryPhone,
      whatsapp_number: payload.whatsappNumber,
      email: payload.email,
      address: payload.address,
      working_hours: payload.workingHours,
      google_maps_link: payload.googleMapsLink,
      updated_at: new Date().toISOString(),
    };
    
    // Remove undefined values
    Object.keys(dbPayload).forEach(key => {
      if ((dbPayload as any)[key] === undefined) {
        delete (dbPayload as any)[key];
      }
    });

    const { error } = await supabase
      .from('settings')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidateTag("settings");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
