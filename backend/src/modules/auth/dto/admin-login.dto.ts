import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'STORE001' })
  @IsString()
  @IsNotEmpty()
  storeCode: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminRegisterDto extends AdminLoginDto {}

export class TableLoginDto {
  @ApiProperty({ example: 'STORE001' })
  @IsString()
  @IsNotEmpty()
  storeCode: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  tableNumber: number;

  @ApiProperty({ example: 'table-pass' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
