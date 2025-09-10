import {IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {TrainingTypeDto} from "./training.type.dto";
import {ERROR_CODES} from "../../common/constants/errors";

export class CreateTrainingDto {
    @IsNotEmpty({ message: ERROR_CODES.STUDENT_REQUIRED })
    @IsString()
    studentId: string;

    @IsNotEmpty({ message: ERROR_CODES.TRAINER_REQUIRED })
    @IsString()
    trainerId: string;

    @IsNotEmpty({ message: ERROR_CODES.TRAINING_NAME_REQUIRED })
    @IsString()
    name: string;

    @IsDefined({ message: ERROR_CODES.DATE_REQUIRED })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    date: number;

    @IsDefined({ message: ERROR_CODES.DURATION_REQUIRED })
    @Type(() => Number)
    @IsNumber({}, { message: ERROR_CODES.INVALID_DURATION })
    @Min(1, { message: ERROR_CODES.INVALID_DURATION })
    duration: number;

    @IsNotEmpty({ message: ERROR_CODES.DESCRIPTION_REQUIRED })
    @IsString()
    description: string;

    @IsNotEmpty({ message: ERROR_CODES.TYPE_REQUIRED })
    @ValidateNested()
    @Type(() => TrainingTypeDto)
    type: TrainingTypeDto;
}
