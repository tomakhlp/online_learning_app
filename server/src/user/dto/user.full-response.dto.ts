import { BaseUserResponseDto } from './user.base-response.dto';
import { StudentEntity } from '../../entities/student.entity';
import { TrainerEntity } from '../../entities/trainer.entity';
import { Role } from '../../common/enums/role.enum';

export class FullUserResponseDto extends BaseUserResponseDto {
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: Role;
  roleData: StudentEntity | TrainerEntity;
}
