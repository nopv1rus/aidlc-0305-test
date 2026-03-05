import { StoreTable } from './table.entity';
import { Menu } from './menu.entity';
import { Admin } from './admin.entity';
export declare class Store {
    id: string;
    storeCode: string;
    name: string;
    createdAt: Date;
    tables: StoreTable[];
    menus: Menu[];
    admins: Admin[];
}
