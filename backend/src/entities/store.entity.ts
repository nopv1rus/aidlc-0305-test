import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { StoreTable } from './table.entity';
import { Menu } from './menu.entity';
import { Admin } from './admin.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  storeCode: string; // 매장 식별자

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => StoreTable, (table) => table.store)
  tables: StoreTable[];

  @OneToMany(() => Menu, (menu) => menu.store)
  menus: Menu[];

  @OneToMany(() => Admin, (admin) => admin.store)
  admins: Admin[];
}
