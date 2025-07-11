import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { SecurityRoles } from 'src/enum';

export class FindAllUsersDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @IsIn(['YES', 'NO'])
  isActive?: string;

  @IsOptional()
  @IsString()
  @IsEnum(SecurityRoles, {
    message: `Allowed roles only these: [${Object.values(SecurityRoles)}]`,
  })
  role?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
