# ASCOPE Generator Script
# Handles data fetching, report generation, and task delegation via AI agents.

import json
import os
from datetime import datetime

# Paths for data and output
TEMPLATE_PATH = os.path.join('data', 'ascope_template.json')
OUTPUT_DIR = os.path.join('output')
REPORT_FILE = os.path.join(OUTPUT_DIR, 'ascope_report.json')

def load_template():
    """Load the ASCOPE template from JSON file."""
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Template file not found at {TEMPLATE_PATH}")
        return None
    with open(TEMPLATE_PATH, 'r') as file:
        return json.load(file)

def generate_ascope_report(template):
    """Generate an ASCOPE report based on the template."""
    if not template:
        print("No template data available to generate the report.")
        return None

    report = {
        "report_id": f"ASCOPE-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "generated_at": datetime.now().isoformat(),
        "content": template
    }
    return report

def save_report(report):
    """Save the generated ASCOPE report to a JSON file."""
    if not report:
        print("No report data available to save.")
        return

    # Ensure the output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(REPORT_FILE, 'w') as file:
        json.dump(report, file, indent=4)
    print(f"Report saved successfully at {REPORT_FILE}")

def main():
    print("Starting ASCOPE Report Generation...")
    
    # Load template
    template_data = load_template()
    if not template_data:
        print("Failed to load template. Exiting.")
        return
    
    # Generate report
    report = generate_ascope_report(template_data.get("template", {}))
    if not report:
        print("Failed to generate report. Exiting.")
        return
    
    # Save report
    save_report(report)
    print("ASCOPE Report Generation Complete.")

if __name__ == "__main__":
    main()