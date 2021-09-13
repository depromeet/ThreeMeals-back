FROM nodejs:14-alpine

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

# install pacakge
COPY package*.json ./
RUN npm install

# copy file
COPY src ./src
COPY tsconfig*.json ./

RUN npm run build

ENV NODE_ENV=${NODE_ENV}

EXPOSE 4000
CMD ["npm", "start"]
