# PR-CYBR-MAP: Puerto Rico Division Database

This repository is dedicated to managing the cyber division mapping for various municipalities in Puerto Rico. The purpose is to streamline the organization and tracking of sector codes and resources within each municipality for enhanced cybersecurity coordination and incident response. This project is managed by the CYWF (Cyber Workforce) initiative.

## Table of Contents
- [Purpose](#purpose)
- [Municipality Division Codes](#municipality-division-codes)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Purpose

The Puerto Rico Division Database (`PR-DIV`) is a structured directory for managing sector codes associated with each municipality in Puerto Rico. Each municipality has a unique `DIV-Code` which links to corresponding sector resources, such as documentation and drive links, for centralized access and efficient navigation.

## Municipality Division Codes

Each municipality in Puerto Rico has been assigned a `DIV-Code` following the format `PRMP-<Municipality Code>`. The division codes are documented in the Sector Database (`Sector-DB`) spreadsheet, which includes:

- **Municipality**: The name of the municipality
- **Sector Code**: The unique sector code (e.g., `PRMP-AGU` for Aguada)
- **Sector Drive Link**: Google Drive link containing shared resources for the municipality
- **Sector DB Link**: Database link with further information specific to the municipality
- **Mission Package Request Link**: Form link for requesting mission-specific packages and resources for the municipality

### Example Table Structure

| Municipality | DIV-Code | Sector-Drive-Link | Sector-DB-Link | Mission-Package-Request-Link |
|--------------|----------|-------------------|----------------|------------------------------|
| Aguadilla    | PRMP-AGD | [Drive Link](https://drive.google.com/...) | [DB Link](https://docs.google.com/...) | [Request Form](https://forms.gle/...) |

For a complete list of municipalities and their associated codes, please refer to the `Sector-DB` in the resources provided.

## Usage

1. **Accessing Sector Resources**: Use the DIV-Code to locate and access sector-specific resources for each municipality.
2. **Requesting Mission Packages**: Fill out the Mission Package Request Form for each municipality as needed for mission-specific requirements.
3. **Contributing Updates**: If there are updates to sector links or division codes, follow the contributing guidelines below.

## Contributing

We welcome contributions to enhance the database and improve its utility. Please follow these steps to contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make updates to the `PR-DIV` directory and update the README as necessary.
4. Commit your changes (`git commit -m 'Add new feature or fix'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
