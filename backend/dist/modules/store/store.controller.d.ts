import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    create(dto: CreateStoreDto): Promise<import("../../entities").Store>;
    findByCode(storeCode: string): Promise<import("../../entities").Store>;
}
