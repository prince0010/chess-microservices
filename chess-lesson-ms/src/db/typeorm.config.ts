import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.LESSON_DB_HOST, // Put here the mysql alias container when using Docker
  port: 3306,
  database: process.env.LESSON_DB_NAME,
  username: process.env.LESSON_DB_USERNAME,
  password: process.env.LESSON_DB_PASSWORD,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
