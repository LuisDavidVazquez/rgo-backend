import { RechargePlanMovement } from '../entities/recharge_plan_movement.entity';

export interface GroupedMovement {
  transactionNumber: string;
  createdAt: Date;
  paymentStatus: string;
  userId: number;
  paymentProvider: string;
  paymentMetadata: any;
  items: RechargePlanMovement[];
  totalAmount: number;
  count: number;
}
