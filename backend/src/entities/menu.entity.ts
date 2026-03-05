import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 0 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Store, (store) => store.menus)
  store: Store;

  @Column()
  storeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
