import { IsString, Length, Matches, MinLength } from "class-validator";
import { cedulaRegEx } from "src/common/constants.helper";

export class CreatePersonDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @Matches(cedulaRegEx, { message: 'Cedula must be exactly 11 digits' })
    cedula: string;
}
