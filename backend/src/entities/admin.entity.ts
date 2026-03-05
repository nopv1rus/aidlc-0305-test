import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from './store.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string; // bcrypt hashed

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  @ManyToOne(() => Store, (store) => store.admins)
  store: Store;

  @Column()
  storeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
