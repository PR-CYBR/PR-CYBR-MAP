document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    var map = L.map('map').setView([18.2208, -66.5901], 8); // Center on Puerto Rico

    // Access tokens
    const JAWG_ACCESS_TOKEN = 'JAWG_ACCESS_TOKEN_PLACEHOLDER';

    // Add the Jawg Matrix tileset
    L.tileLayer(`https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=${JAWG_ACCESS_TOKEN}`, {
        attribution: '<a href="https://jawg.io" target="_blank">© Jawg</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        minZoom: 0,
        maxZoom: 22
    }).addTo(map);

    let cityDataGlobal = []; // To store marker data globally

    // Load markers from the JSON file
    fetch('data/markers.json')
        .then(response => response.json())
        .then(data => {
            cityDataGlobal = data.markers; // Store data globally
            data.markers.forEach(markerData => {
                // Create custom popup content
                var popupContent = `
                    <div>
                        <h3>${markerData.name}</h3>
                        <p>${markerData.description}</p>
                        <div style="text-align: right;">
                            <a href="#" class="see-more-link" data-city="${markerData.name}">See More</a>
                        </div>
                    </div>
                `;

                // Create a marker with the custom popup
                L.marker([markerData.lat, markerData.lng])
                    .bindPopup(popupContent)
                    .addTo(map);
            });
        })
        .catch(error => console.error("Error loading markers:", error));

    // Event listener for popups to handle "See More" clicks
    map.on('popupopen', function (e) {
        var popupNode = e.popup.getElement();
        var seeMoreLink = popupNode.querySelector('.see-more-link');
        if (seeMoreLink) {
            seeMoreLink.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent the default anchor behavior
                var cityName = this.getAttribute('data-city');
                openSidebar(cityName);
                map.closePopup(); // Close the popup after clicking "See More"
            });
        }
    });

    // Function to open the sidebar with more information
    function openSidebar(cityName) {
        // Find the city data
        var cityData = cityDataGlobal.find(marker => marker.name === cityName);

        if (cityData) {
            var sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = `
                <div class="sidebar-content">
                    <h2>${cityData.name}</h2>
                    <p>${cityData.moreInfo}</p>
                    <button id="close-sidebar">Close</button>
                </div>
            `;
            sidebar.classList.add('active');

            // Adjust map size
            document.getElementById('map').style.width = 'calc(100% - 400px)';
            map.invalidateSize();

            // Close button event listener
            document.getElementById('close-sidebar').addEventListener('click', function () {
                sidebar.classList.remove('active');
                document.getElementById('map').style.width = '100%';
                map.invalidateSize();
            });
        }
    }
});