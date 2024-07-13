import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { Person, PersonSchema } from './entities/person.entity';
import { MongooseModule } from '@nestjs/mongoose';

const mongooseModule = MongooseModule.forFeature([{
  name: Person.name,
  schema: PersonSchema,
}])

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [
    mongooseModule
  ]
})
export class PeopleModule { }
