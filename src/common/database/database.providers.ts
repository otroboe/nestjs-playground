import { createConnection, Connection } from 'typeorm';

import { config, IConfig } from '../../config';
import { constants } from '../../constants';

const createConfiguration = (data: IConfig): any => {
  const { type, host, port, username, password, database } = data.db;
  const { synchronize, logging, entities } = data.orm;

  return {
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize,
    logging,
    entities,
  };
};

export const databaseProviders = [
  {
    provide: constants.TOKEN_DB_CONNECTION,
    useFactory: async (): Promise<Connection> => await createConnection(createConfiguration(config)),
  },
];
