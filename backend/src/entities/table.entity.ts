import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Store } from './store.entity';
import { Order } from './order.entity';

@Entity('store_tables')
export class StoreTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tableNumber: number;

  @Column()
  password: string; // bcrypt hashed

  @Column({ type: 'varchar', nullable: true })
  sessionId: string | null; // 현재 테이블 세션 ID

  @Column({ type: 'timestamp', nullable: true })
  sessionStartedAt: Date | null;

  @ManyToOne(() => Store, (store) => store.tables)
  store: Store;

  @Column()
  storeId: string;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;
}
