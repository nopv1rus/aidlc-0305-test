import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, UpdateMenuSortDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    findByStore(storeId: string, category?: string): Promise<import("../../entities").Menu[]>;
    create(req: any, dto: CreateMenuDto): Promise<import("../../entities").Menu>;
    updateSort(req: any, dto: UpdateMenuSortDto): Promise<void>;
    update(req: any, id: string, dto: UpdateMenuDto): Promise<import("../../entities").Menu>;
    remove(req: any, id: string): Promise<void>;
}
