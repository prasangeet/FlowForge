FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Create directory for file uploads if you're using multer
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "start"]