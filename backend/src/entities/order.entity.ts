import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { StoreTable } from './table.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',       // 대기중
  PREPARING = 'preparing',   // 준비중
  COMPLETED = 'completed',   // 완료
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: number; // 매장 내 주문 번호 (당일 순번)

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 0 })
  totalAmount: number;

  @Column()
  sessionId: string; // 테이블 세션 ID

  @ManyToOne(() => StoreTable, (table) => table.orders)
  table: StoreTable;

  @Column()
  tableId: string;

  @Column()
  storeId: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  orderedAt: Date;
}
