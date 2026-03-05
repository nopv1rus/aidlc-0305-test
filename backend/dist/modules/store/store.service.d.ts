import { Repository } from 'typeorm';
import { Store } from '../../entities';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoreService {
    private readonly storeRepo;
    constructor(storeRepo: Repository<Store>);
    create(dto: CreateStoreDto): Promise<Store>;
    findByCode(storeCode: string): Promise<Store>;
    findById(id: string): Promise<Store>;
}
