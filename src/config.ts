import 'dotenv/config';
import * as path from 'path';

interface IDatabase {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface IORM {
  synchronize: boolean;
  logging: boolean | string | string[];
  entities: string[];
}

export interface IConfig {
  env: string;
  db: IDatabase;
  orm: IORM;
}

const parseBoolean = (input: string): boolean => {
  return input !== undefined && input === 'true';
};

// Logging possible values: http://typeorm.io/#/logging
const parseLogging = (input: string): boolean | string | string[] => {
  switch (input) {
    case 'true':
    case undefined:
    case '':
      return true;
    case 'false':
      return false;
    case 'all':
      return 'all';
    default:
      return input.split(',');
  }
};

export const config: IConfig = {
  env: process.env.NODE_ENV || 'development',
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'rams-user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'rams',
  },
  orm: {
    synchronize: parseBoolean(process.env.ORM_SYNCHRONIZE),
    logging: parseLogging(process.env.ORM_LOGGING),
    entities: [process.env.ORM_ENTITIES || path.join(__dirname, '/**/**.entity{.ts,.js}')],
  },
};
