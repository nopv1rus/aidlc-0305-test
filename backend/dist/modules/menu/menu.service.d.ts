import { Repository } from 'typeorm';
import { Menu } from '../../entities';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
export declare class MenuService {
    private readonly menuRepo;
    constructor(menuRepo: Repository<Menu>);
    create(storeId: string, dto: CreateMenuDto): Promise<Menu>;
    findByStore(storeId: string, category?: string): Promise<Menu[]>;
    update(id: string, storeId: string, dto: UpdateMenuDto): Promise<Menu>;
    remove(id: string, storeId: string): Promise<void>;
    updateSortOrder(storeId: string, items: {
        id: string;
        sortOrder: number;
    }[]): Promise<void>;
}
