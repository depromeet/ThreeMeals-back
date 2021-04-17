module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  charset: 'utf8',
  driver: 'mysql',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/dist/entities/**/**.entity.{js,ts}'],
  logging: process.env.NODE_ENV !== 'production' ? 'all' : 'error',
  migrations: ['migration/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
  connectTimeout: 30000,
  acquireTimeout: 30000,
};
