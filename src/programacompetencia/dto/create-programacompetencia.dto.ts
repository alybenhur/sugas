import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateProgramacompetenciaDto {

    // @IsNotEmpty()
    // @IsNumber()
    programaId : number;

    //  @IsNotEmpty()
    //  @IsArray()
    //  @IsNumber({}, { each: true })
    competenciaId : number[];
}
