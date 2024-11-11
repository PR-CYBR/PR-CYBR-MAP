import csv
import json

# List to hold the data
data = []

# Open the CSV file and read its contents
with open('PR-CYBR-MAP.csv', 'r', encoding='utf-8') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        # Create a dictionary for each municipality
        municipality = {
            "Municipality": row['Municipality'],
            "Latitude": float(row['Latitude']),
            "Longitude": float(row['Longitude']),
            "Description": ""  # Placeholder for Description
        }
        data.append(municipality)

# Write the data to a JSON file
with open('PR-CYBR-MAP.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, ensure_ascii=False, indent=2)

print("Conversion complete. JSON data saved to PR-CYBR-MAP.json")