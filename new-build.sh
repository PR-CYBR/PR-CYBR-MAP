#!/bin/bash

# PR-CYBR-MAP Setup Script

# 3. Initialize Next.js Project with TypeScript
echo "Initializing Next.js project with TypeScript..."
npx create-next-app@latest . --typescript

# 4. Install D3.js
echo "Installing D3.js..."
npm install d3

# 5. Install Tailwind CSS and Dependencies
echo "Installing Tailwind CSS and its dependencies..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 6. Configure Tailwind CSS
echo "Configuring Tailwind CSS..."
# Append Tailwind directives to global CSS
cat <<EOT >> styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOT

# Update Tailwind configuration
sed -i '' 's|content: \[\],|content: \["./pages/\*\*/\*.\{js,ts,jsx,tsx\}", "./components/\*\*/\*.\{js,ts,jsx,tsx\}"\],|' tailwind.config.js

# 7. Initialize Git Repository
echo "Initializing Git repository..."
git init
git add .
git commit -m "Initial commit with Next.js, TypeScript, D3.js, and Tailwind CSS setup"

# 8. Deploy to Vercel (Optional)
# echo "Deploying to Vercel..."
# vercel --prod

# 9. Display Access Instructions
echo "Setup complete!"
echo "To view your site locally, run:"
echo "  npm run dev"
echo "Then open your browser and navigate to http://localhost:3000"
echo "To deploy your site, ensure you have the Vercel CLI installed and run:"
echo "  vercel --prod"