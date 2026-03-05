import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: '김치찌개' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 9000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '매콤한 김치찌개', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '찌개류' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class UpdateMenuSortDto {
  @ApiProperty({
    description: '메뉴 ID와 순서 배열',
    example: [{ id: 'uuid-1', sortOrder: 0 }, { id: 'uuid-2', sortOrder: 1 }],
  })
  @IsArray()
  items: { id: string; sortOrder: number }[];
}

