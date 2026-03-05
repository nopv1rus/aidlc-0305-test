import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  menuName: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 0 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 0 })
  subtotal: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  orderId: string;
}
