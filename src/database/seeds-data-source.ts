import { DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './data-source';

//typeorm-seeding is usnig a typeorm deprecated database Connection, so we are exporting the options directly instead of instantiating a Data Source

type options = DataSourceOptions & {
  seeds: string[];
  factories: string[];
};

const seedsDataSource: options = {
  ...dataSourceOptions,
  seeds: ['src/database/seeds/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

export default seedsDataSource;
