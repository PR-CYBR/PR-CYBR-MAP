import os
import qrcode
import datetime

# Root directory for divisions
ROOT_DIR = "PR-DIV"

# Process each division
for div in os.listdir(ROOT_DIR):
    tak_dir = os.path.join(ROOT_DIR, div, "TAK")
    beacons_file = os.path.join(tak_dir, "beacons.txt")
    
    # Check if the beacons.txt file exists
    if os.path.isfile(beacons_file):
        with open(beacons_file, 'r') as file:
            lines = file.readlines()
        
        for line in lines:
            # Skip comments or empty lines
            if line.startswith("#") or not line.strip():
                continue
            
            # Parse the URL
            url = line.strip()
            
            # Generate QR code
            qr = qrcode.make(url)
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            qr_path = os.path.join(tak_dir, f"qr_{timestamp}.png")
            qr.save(qr_path)
            print(f"QR code generated and saved at {qr_path}")