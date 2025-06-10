# Installation

1. Set up .env file with NODE_ENV and DATABASE credentials
2. Install nvm, then install npm 14.
3. npm install in the main directory, and in the client directory.
4. npm start in server and client folders

# (Re-)deployment

1. Pull changes from git
2. rm -rf build in the client folder (if needed)
3. npm run build the client
4. rm -rf /var/www/html/build to empty the deployment folder
5. cp -r build /var/www/html to copy build folder to the deployment folder
6. sudo systemctl restart rgmg.service to restart the server code