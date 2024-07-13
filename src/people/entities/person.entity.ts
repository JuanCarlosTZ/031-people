import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Person extends Document {
    @Prop({
        required: true,
        minlength: 1,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        length: 11,
        index: true,
    })
    cedula: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
