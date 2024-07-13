import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PeopleModule } from './people/people.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './people/entities/person.entity';

const serveStaticModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'public'),
  exclude: ['/api/(.*)'],
});

const mongooseModule = MongooseModule.forRoot('mongodb://localhost:27017/nest-people');


@Module({
  imports: [
    serveStaticModule,
    mongooseModule,
    PeopleModule
  ],
})
export class AppModule { }
