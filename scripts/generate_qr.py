import os
import qrcode

# Define the root directory to search for TAK files
ROOT_DIR = "PR-DIV"
TAK_SUBDIR = "TAK"

def generate_qr_from_file(file_path, output_dir):
    with open(file_path, "r") as file:
        for line in file:
            link = line.strip()
            if link:
                # Create a QR code
                qr = qrcode.make(link)
                # Save QR code as .png in the TAK directory
                qr_code_filename = os.path.join(output_dir, f"{link.split('//')[-1].replace('/', '_')}.png")
                qr.save(qr_code_filename)
                print(f"Generated QR Code for: {link}")

def main():
    for root, dirs, files in os.walk(ROOT_DIR):
        if TAK_SUBDIR in root:
            for file in files:
                if file.endswith(".txt"):
                    file_path = os.path.join(root, file)
                    output_dir = os.path.dirname(file_path)
                    generate_qr_from_file(file_path, output_dir)

if __name__ == "__main__":
    main()