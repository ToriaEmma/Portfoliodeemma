import os
from PIL import Image

def convert_to_webp(source_dir):
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                webp_path = os.path.splitext(file_path)[0] + ".webp"
                
                try:
                    with Image.open(file_path) as img:
                        img.save(webp_path, "WEBP")
                        print(f"Converted {file} to {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

if __name__ == "__main__":
    convert_to_webp("/home/emma/Portfoliodeemma/img/CCIN 10")
