import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from '../../entities';

const mockMenu: Partial<Menu> = {
  id: 'menu-uuid',
  name: '김치찌개',
  price: 9000,
  category: '찌개류',
  storeId: 'store-uuid',
  isAvailable: true,
  sortOrder: 0,
};

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockMenu]),
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: getRepositoryToken(Menu), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    jest.clearAllMocks();
    mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  describe('create', () => {
    it('should create a menu item', async () => {
      mockRepo.create.mockReturnValue(mockMenu);
      mockRepo.save.mockResolvedValue(mockMenu);

      const result = await service.create('store-uuid', {
        name: '김치찌개', price: 9000, category: '찌개류',
      });
      expect(result).toEqual(mockMenu);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: '김치찌개', price: 9000, category: '찌개류', storeId: 'store-uuid',
      });
    });
  });

  describe('findByStore', () => {
    it('should return menus for a store', async () => {
      const result = await service.findByStore('store-uuid');
      expect(result).toEqual([mockMenu]);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should filter by category when provided', async () => {
      await service.findByStore('store-uuid', '찌개류');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2); // isAvailable + category
    });
  });

  describe('update', () => {
    it('should update a menu item', async () => {
      const updated = { ...mockMenu, name: '된장찌개' };
      mockRepo.findOne.mockResolvedValue({ ...mockMenu });
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update('menu-uuid', 'store-uuid', { name: '된장찌개' });
      expect(result.name).toBe('된장찌개');
    });

    it('should throw NotFoundException if menu not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update('invalid', 'store-uuid', { name: 'x' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a menu item', async () => {
      mockRepo.findOne.mockResolvedValue(mockMenu);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove('menu-uuid', 'store-uuid');
      expect(mockRepo.remove).toHaveBeenCalledWith(mockMenu);
    });

    it('should throw NotFoundException if menu not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('invalid', 'store-uuid'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSortOrder', () => {
    it('should update sort orders for multiple items', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 });
      const items = [
        { id: 'id-1', sortOrder: 0 },
        { id: 'id-2', sortOrder: 1 },
      ];

      await service.updateSortOrder('store-uuid', items);
      expect(mockRepo.update).toHaveBeenCalledTimes(2);
    });
  });
});
