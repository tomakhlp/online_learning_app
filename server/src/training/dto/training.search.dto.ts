import {IsInt, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class SearchTrainingDto {
    @IsOptional()
    @IsString()
    trainerName?: string;

    @IsOptional()
    @IsString()
    studentName?: string;

    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    startDate?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    endDate?: number;
}
