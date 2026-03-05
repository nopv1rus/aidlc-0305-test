import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  tableNumber: number;

  @ApiProperty({ example: 'table-pass-123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
