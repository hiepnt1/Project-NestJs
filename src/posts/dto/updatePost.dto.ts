import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDTO {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string
}