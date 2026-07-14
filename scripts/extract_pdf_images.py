import os
import fitz  # PyMuPDF
from PIL import Image
import io
import json
import re
from pathlib import Path

# rembg uses ONNX runtime, we import the simple interface
from rembg import remove

# Directories
DOCS_DIR = Path(__file__).parent.parent / 'docs'
OUT_DIR = Path(__file__).parent.parent / 'scratch' / 'extracted_pdf_images'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Generate index
index_data = []

def clean_text(text):
    # Just basic cleaning to use as filename/hint
    return re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip()

def process_pdf(pdf_path):
    print(f"Processing {pdf_path.name}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Failed to open {pdf_path}: {e}")
        return

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # Get text for context
        text = page.get_text("text")
        
        # We can extract the top 3 lines for context or a quick summary
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        context_text = " ".join(lines[:5]) if lines else "Unknown Product"
        
        # Extract images
        image_list = page.get_images(full=True)
        if not image_list:
            continue
            
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                ext = base_image["ext"]
                
                # Load with PIL
                image = Image.open(io.BytesIO(image_bytes))
                
                # Filter small images (logos, icons)
                if image.width < 150 or image.height < 150:
                    continue
                    
                # Remove background
                print(f"  Removing background for image {img_index} on page {page_num+1}...")
                # Note: first run of rembg will download the U2Net model
                output_image = remove(image)
                
                # Crop to bounding box
                bbox = output_image.getbbox()
                if bbox:
                    output_image = output_image.crop(bbox)
                
                # Generate a unique slug
                base_name = f"{pdf_path.stem}_p{page_num+1}_i{img_index}"
                out_file = OUT_DIR / f"{base_name}.webp"
                
                # Convert to WebP and save
                # output_image is RGBA from rembg
                output_image.save(out_file, format="webp", quality=85)
                
                # Add to index
                index_data.append({
                    "filename": f"{base_name}.webp",
                    "source_pdf": pdf_path.name,
                    "page": page_num + 1,
                    "detected_text": context_text[:100]  # Just 100 chars context
                })
                print(f"  Saved {out_file.name}")
                
            except Exception as e:
                print(f"  Failed to process image {img_index} on page {page_num+1}: {e}")

def main():
    pdfs = list(DOCS_DIR.glob('*.pdf'))
    if not pdfs:
        print("No PDFs found in docs/")
        return
        
    for pdf in pdfs:
        process_pdf(pdf)
        
    # Save index
    index_file = OUT_DIR / 'index.json'
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2)
        
    print(f"Done! Extracted {len(index_data)} images. Index saved to {index_file}")

if __name__ == "__main__":
    main()
