#!/bin/bash

# Set project name
PROJECT_NAME="pr-cybr-map"

# Create project directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Create necessary directories
mkdir -p app/static/css
mkdir -p app/static/js
mkdir -p app/templates
mkdir -p app/api

# Initialize virtual environment
python3 -m venv venv
echo "Virtual environment created."

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install Flask flask-restful
echo "Flask and Flask-RESTful installed."

# Create main application file
cat > app/app.py << EOL
from flask import Flask, render_template
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
EOL

# Create basic index.html with Leaflet.js integration
cat > app/templates/index.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>PR-CYBR-MAP</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        #map {
            height: 100vh;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="/static/js/map.js"></script>
</body>
</html>
EOL

# Create Leaflet.js map initialization script
cat > app/static/js/map.js << EOL
document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([18.2208, -66.5901], 8); // Center on Puerto Rico

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Example marker
    L.marker([18.2208, -66.5901]).addTo(map)
        .bindPopup('PR-CYBR Node')
        .openPopup();
});
EOL

# Create REST API placeholder
cat > app/api/nodes.py << EOL
from flask_restful import Resource

class NodeAPI(Resource):
    def get(self):
        # Example data
        return {
            "nodes": [
                {"id": 1, "name": "San Juan", "lat": 18.4655, "lon": -66.1057},
                {"id": 2, "name": "Ponce", "lat": 18.0111, "lon": -66.6141}
            ]
        }
EOL

# Add API to app.py
cat >> app/app.py << EOL

# Import NodeAPI and add resource to API
from api.nodes import NodeAPI
api.add_resource(NodeAPI, "/api/nodes")
EOL

# Create requirements.txt for dependencies
pip freeze > requirements.txt

# Create run script
cat > run.sh << EOL
#!/bin/bash

source venv/bin/activate
python app/app.py
EOL

chmod +x run.sh

echo "Project setup completed! Run './run.sh' to start the development server."
