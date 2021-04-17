import { config } from './src/config';

module.exports = {
  name: 'default',
  type: config.db.default.dialect,
  host: config.db.default.host,
  username: config.db.default.username,
  password: config.db.default.password,
  database: config.db.default.database,
  charset: 'utf8',
  driver: 'mysql',
  synchronize: config.db.default.synchronize,
  entities: [__dirname + '/dist/entities/**/**.entity.{js,ts}'],
  logging: config.db.default.logging,
  migrations: ['migration/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
  connectTimeout: config.db.default.connectionTimeout,
  acquireTimeout: 30000,
  extra: {
    charset: 'utf8mb4_general_ci',
    connectionLimit: config.db.default.maximumPoolSize,
  },
};
