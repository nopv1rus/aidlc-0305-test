import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('order_history')
export class OrderHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: number;

  @Column()
  sessionId: string;

  @Column()
  storeId: string;

  @Column()
  tableNumber: number;

  @Column('decimal', { precision: 10, scale: 0 })
  totalAmount: number;

  @Column('jsonb')
  items: { menuName: string; quantity: number; unitPrice: number; subtotal: number }[];

  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  orderedAt: Date;

  @Column({ type: 'timestamp' })
  completedAt: Date; // 매장 이용 완료 시각
}
