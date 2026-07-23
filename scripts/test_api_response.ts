
import { adminListProductsPaged } from '../src/services/product.service';

async function main() {
  const result = await adminListProductsPaged();
  console.log('Got', result.data?.products?.length, 'products');
  if (result.data?.products && result.data.products.length > 0) {
    const p = result.data.products[0];
    console.log('Sample product:', p.name, 'featured_image:', (p as any).featured_image, 'featuredImage:', p.featuredImage);
    const missing = result.data.products.filter((p: any) => !p.featuredImage);
    console.log('Products missing featuredImage:', missing.length);
  }
}

main();

