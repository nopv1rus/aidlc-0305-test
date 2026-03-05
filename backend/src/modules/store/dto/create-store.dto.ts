import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ description: '매장 식별 코드', example: 'STORE001' })
  @IsString()
  @IsNotEmpty()
  storeCode: string;

  @ApiProperty({ description: '매장명', example: '맛있는 식당' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
