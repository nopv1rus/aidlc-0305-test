import { Store } from './store.entity';
export declare class Menu {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    sortOrder: number;
    isAvailable: boolean;
    store: Store;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
}
