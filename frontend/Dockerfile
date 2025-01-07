FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Add these flags to handle peer dependencies
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]