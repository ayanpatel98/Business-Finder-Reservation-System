# **************************** Modified ********************
FROM node:16 AS server-build
WORKDIR /ayan
COPY package*.json ./
RUN npm install
# copy all contents from the backend folder to the VM
COPY . .
EXPOSE 8080

CMD ["npm", "start"]







# ***************** Original ***********************

# # Angular App dockerize
# # Stage 1
# FROM node:16 AS ui-build
# WORKDIR /ayan/frontend
# COPY ./frontend .
# RUN npm install @angular/cli && npm install && npm run build
# # Stage 2
# FROM nginx:alpine
# COPY --from=ui-build /ayan/dist/frontend /usr/share/nginx/html



# # Node app Dockerize
# FROM node:16 AS server-build
# WORKDIR /ayan/backend
# COPY backend/package*.json ./
# RUN npm install
# COPY backend/ ./

# # docker run -p xyz:8080/tcp -d business | xyz can be any number e.g. 8080,1234
# EXPOSE 8080

# CMD ["node", "server.js"]