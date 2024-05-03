# Stage di sviluppo
FROM node as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
EXPOSE 49153
CMD ["tail", "-f", "/dev/null"]

# Stage di costruzione per la produzione
FROM node as build-stage
WORKDIR /app
COPY --from=dev-stage /app .
RUN npm run build --prod

# Stage di produzione con Nginx
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist/angular-app /usr/share/nginx/html

COPY cert.key /etc/ssl/certs
COPY cert.crt /etc/ssl/certs
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
