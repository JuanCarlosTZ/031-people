import { BadRequestException, HttpCode, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Person } from './entities/person.entity';
import { InjectModel } from '@nestjs/mongoose';
import { cedulaRegEx } from 'src/common/constants.helper';

@Injectable()
export class PeopleService {

  constructor(
    @InjectModel(Person.name)
    private readonly people: Model<Person>) { }

  async create(createPersonDto: CreatePersonDto) {
    createPersonDto.name == this.formatteData(createPersonDto.name);

    try {
      const person = await this.people.create(createPersonDto);
      return person;

    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.people.find();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(term: string) {
    const isValidId = isValidObjectId(term);
    const isValidCedula = cedulaRegEx.test(term);

    if (!isValidId && !isValidCedula) {
      throw new BadRequestException(`${term} is not a valid term`)
    }

    let person: Person;
    try {

      if (isValidId) {
        person = await this.people.findById(term);
      }

      if (isValidCedula) {
        person = await this.people.findOne({ cedula: term });
      }

    } catch (error) {
      this.handleError(error);
    }

    if (!person) {
      throw new NotFoundException();
    }
    return person;
  }

  async update(term: string, updatePersonDto: UpdatePersonDto) {
    let person = await this.findOne(term);
    updatePersonDto.name = this.formatteData(updatePersonDto.name);

    try {
      person = await this.people.findByIdAndUpdate(
        person.id,
        updatePersonDto,
        { new: true },
      );
    } catch (error) {
      this.handleError(error);

    }

    return person;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} is not a mongodbID`)
    }

    try {
      const { deletedCount } = await this.people.deleteOne({ _id: id });
      if (deletedCount === 0) {
        throw new NotFoundException(`Person do not exist with id ${id}`);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {

    if (error.code === 11000) {
      throw new BadRequestException(`Person exists with ${JSON.stringify(error.keyValue)}`);
    }

    if (error.status === HttpStatus.NOT_FOUND) {
      throw error;
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs');
  }

  formatteData(value: string): string {
    let newValue = value.trim();
    newValue = newValue.toLowerCase();
    return newValue;
  }

}
