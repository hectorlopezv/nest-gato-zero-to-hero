import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'tasks-managment',
  autoLoadEntities: true,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
