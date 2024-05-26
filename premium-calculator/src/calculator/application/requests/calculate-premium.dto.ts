import { IsString, IsDate, IsNotEmpty, Length, Matches, IsInt, Min, Max, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidAge } from './is-valid-age.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculatePremiumDto {
  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ example: 'CA' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  @Matches(/^(?:A[LKSZRAEP]|C[AOT]|D[EC]|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/, {
    message: 'State must be a valid US state abbreviation',
  })
  state: string;

  @ApiProperty({ example: 34 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Validate(IsValidAge)
  age: number;

  @ApiProperty({ example: 'A' })
  @IsNotEmpty()
  @IsString()
  plan: string;
}
