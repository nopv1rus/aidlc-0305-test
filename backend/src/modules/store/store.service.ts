import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../entities';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const exists = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
    if (exists) throw new ConflictException('이미 존재하는 매장 코드입니다.');
    const store = this.storeRepo.create(dto);
    return this.storeRepo.save(store);
  }

  async findByCode(storeCode: string): Promise<Store> {
    const store = await this.storeRepo.findOne({ where: { storeCode } });
    if (!store) throw new NotFoundException('매장을 찾을 수 없습니다.');
    return store;
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) throw new NotFoundException('매장을 찾을 수 없습니다.');
    return store;
  }
}
