FROM node:14-alpine
WORKDIR /app

# install pacakge
COPY package*.json ./
RUN npm install --silent

# copy file
COPY src ./src
COPY tsconfig*.json ./

RUN npm run build

ENV NODE_ENV=${NODE_ENV}

EXPOSE 4000
CMD ["npm", "start"]
