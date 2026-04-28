# Installation

1. Set up .env file with NODE_ENV and DATABASE credentials
2. Install nvm, then install npm 14.
3. npm install in the main directory, and in the client directory.
4. npm start in server and client folders

# Automated (Re-)deployment
1. SSH into host Oracle Cloud machine
2. Run ./deploy.sh. Optionally, provide --client-only or --server-only flags if only one portion needs to be redeployed.

# Manual (Re-)deployment

1. SSH into host Oracle Cloud machine
2. Change to code directory (e.g. ~/code/rohoTables/)
3. Pull changes from git
4. rm -rf build in the client folder (if needed)
5. npm run build the client
6. sudo rm -rf /var/www/html/build to empty the deployment folder
7. sudo cp -r build /var/www/html to copy build folder to the deployment folder
8. sudo systemctl restart rgmg.service to restart the server

# Local Development Hosting
1. Ensure local .env file is pointing to development database
2. Install cloudflared if not already installed
3. npm build the client and then npm run the server
4. cloudflared tunnel --url http://localhost:5000 to start the local hosting