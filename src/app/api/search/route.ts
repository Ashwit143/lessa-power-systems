import { NextResponse } from "next/server";
import { searchProducts } from "@/services/product.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(query.trim());
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
