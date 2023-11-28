# syntax=docker/dockerfile:1

FROM node:18.6-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["npm", "run", "no-build-start"]
LABEL org.opencontainers.image.source=https://github.com/Team-Resourceful/Resourceful-Config-Web
LABEL org.opencontainers.image.description="Resourceful Config Web Server"
LABEL org.opencontainers.image.licenses=MIT