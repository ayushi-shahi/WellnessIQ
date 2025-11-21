# Dockerfile in ./frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev", "--", "--port", "5000", "--host"]
