# Usa un'immagine Node.js come base
FROM node:latest

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia il file package.json e package-lock.json nella directory di lavoro
COPY package*.json .

# Installa le dipendenze del progetto
RUN npm install

RUN npm install -g @angular/cli

# Copia il codice sorgente dell'applicazione nella directory di lavoro
COPY . .

# Avvia l'applicazione React Native
# CMD ["npm", "start"]

EXPOSE 4200 
EXPOSE 49153

# Esegui un comando personalizzato all'avvio del container
ENTRYPOINT ["tail", "-f", "/dev/null"]