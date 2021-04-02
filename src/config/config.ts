import * as dotenv from 'dotenv';

dotenv.config();

type IConfig = {
  username: string,
  password: string,
  database: string,
  [key: string]: any,
};

interface IConfigGroup {
  development: IConfig;
  test: IConfig;
  production: IConfig;
}

const config: IConfigGroup = {
  development: {
    username: 'root',
    password: '1234',
    database: 'bb',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: '1234',
    database: 'bb',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: '1234',
    database: 'bb',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;
