import {IsNotEmpty, IsString} from "class-validator";

export class TrainingTypeDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    trainingType: string;
}
