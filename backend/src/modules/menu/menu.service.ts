import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../entities';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
  ) {}

  async create(storeId: string, dto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepo.create({ ...dto, storeId });
    return this.menuRepo.save(menu);
  }

  async findByStore(storeId: string, category?: string): Promise<Menu[]> {
    const query = this.menuRepo
      .createQueryBuilder('menu')
      .where('menu.storeId = :storeId', { storeId })
      .andWhere('menu.isAvailable = :available', { available: true })
      .orderBy('menu.category', 'ASC')
      .addOrderBy('menu.sortOrder', 'ASC');

    if (category) {
      query.andWhere('menu.category = :category', { category });
    }
    return query.getMany();
  }

  async update(id: string, storeId: string, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepo.findOne({ where: { id, storeId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    Object.assign(menu, dto);
    return this.menuRepo.save(menu);
  }

  async remove(id: string, storeId: string): Promise<void> {
    const menu = await this.menuRepo.findOne({ where: { id, storeId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    await this.menuRepo.remove(menu);
  }

  async updateSortOrder(storeId: string, items: { id: string; sortOrder: number }[]): Promise<void> {
    for (const item of items) {
      await this.menuRepo.update({ id: item.id, storeId }, { sortOrder: item.sortOrder });
    }
  }

}
