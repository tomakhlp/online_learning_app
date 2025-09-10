import {IsNotEmpty, IsString} from "class-validator";
import {ERROR_CODES} from "../../common/constants/errors";

export class UploadPhotoDto {
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.PHOTO_REQUIRED })
    data: string;
}
