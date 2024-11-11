// ASCOPE Report JavaScript functionality
// Handles rendering of ASCOPE reports in the sidebar

document.addEventListener('DOMContentLoaded', () => {
    console.log("ASCOPE Report JavaScript initialized");

    // Fetch ASCOPE template data from JSON
    fetch('data/ascope_template.json')
        .then(response => response.json())
        .then(template => {
            initializeASCOPEReport(template.template);
        })
        .catch(error => {
            console.error("Error fetching ASCOPE template data:", error);
        });
});

// Function to initialize ASCOPE report rendering
function initializeASCOPEReport(template) {
    const reportContainer = document.createElement('div');
    reportContainer.classList.add('ascope-report-container');
    document.getElementById('sidebar').appendChild(reportContainer);

    // Generate HTML for each ASCOPE section
    Object.keys(template).forEach(section => {
        const sectionData = template[section];
        const sectionElement = createSectionElement(section, sectionData);
        reportContainer.appendChild(sectionElement);
    });
}

// Function to create a section element for the ASCOPE report
function createSectionElement(sectionName, sectionData) {
    const sectionElement = document.createElement('div');
    sectionElement.classList.add('ascope-section');

    // Add section title
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = sectionName;
    sectionElement.appendChild(sectionTitle);

    // Add section description
    const sectionDescription = document.createElement('p');
    sectionDescription.textContent = sectionData.description || "No description available.";
    sectionElement.appendChild(sectionDescription);

    // Add key points if available
    if (Array.isArray(sectionData.key_locations) || Array.isArray(sectionData.critical_infrastructure) || Array.isArray(sectionData.resources)) {
        const list = document.createElement('ul');
        (sectionData.key_locations || sectionData.critical_infrastructure || sectionData.resources || []).forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });
        sectionElement.appendChild(list);
    }

    return sectionElement;
}