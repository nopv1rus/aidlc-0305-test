import { Store } from './store.entity';
export declare class Admin {
    id: string;
    username: string;
    password: string;
    loginAttempts: number;
    lockedUntil: Date | null;
    store: Store;
    storeId: string;
    createdAt: Date;
}
