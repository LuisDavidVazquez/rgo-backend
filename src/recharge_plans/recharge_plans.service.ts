import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRechargePlanDto } from './dto/create-recharge_plan.dto';
import { UpdateRechargePlanDto } from './dto/update-recharge_plan.dto';
import { RechargePlan } from './entities/recharge_plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargePlanMovement } from 'src/recharge_plan_movements/entities/recharge_plan_movement.entity';
import { HttpException } from '@nestjs/common';

@Injectable()
export class RechargePlansService {

  constructor(
    @InjectRepository(RechargePlan)
    private readonly rechargePlanRepository: Repository<RechargePlan>,
    @InjectRepository(RechargePlanMovement)
    private readonly rechargePlanMovementRepository: Repository<RechargePlanMovement>,
  ) {}


  async create(createRechargePlanDto: CreateRechargePlanDto): Promise<RechargePlan> {
    const newPlan = this.rechargePlanRepository.create(createRechargePlanDto);
    return this.rechargePlanRepository.save(newPlan);
  }

  async createOrUpdate(createRechargePlanDto: CreateRechargePlanDto): Promise<RechargePlan> {
    return this.rechargePlanRepository.save(createRechargePlanDto);
  }

  async findAll(): Promise<RechargePlan[]> {
    return this.rechargePlanRepository.find(); // Esta línea recuperará todos los planes de la base de datos.
  }

  async findOne(id: number): Promise<RechargePlan> {
    const plan = await this.rechargePlanRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Recharge Plan with ID ${id} not found`);
    }
    return plan;
  }


  async replaceId(oldId: number, newId: number): Promise<RechargePlan> {
    const plan = await this.findOne(oldId);
    if (!plan) {
        throw new NotFoundException(`Recharge Plan with ID ${oldId} not found`);
    }

    // Verifica que no exista ya un plan con el nuevo ID
    const existingPlan = await this.rechargePlanRepository.findOneBy({ id: newId });
    if (existingPlan) {
        throw new HttpException(`Recharge Plan with ID ${newId} already exists`, 400);
    }

    // Clona el plan existente y asigna el nuevo ID
    const newPlan = this.rechargePlanRepository.create({ ...plan, id: newId });
    await this.rechargePlanRepository.remove(plan);
    return this.rechargePlanRepository.save(newPlan);
}





  async update(id: number, updateRechargePlanDto: UpdateRechargePlanDto): Promise<RechargePlan> {
    const updateResult = await this.rechargePlanRepository.update(id, updateRechargePlanDto);
    if (!updateResult.affected) {
      throw new NotFoundException(`Recharge Plan with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.rechargePlanRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Recharge Plan with ID ${id} not found`);
    }
  }



  

  async savePaymentDetails(paymentDetails) {
    const newMovement = this.rechargePlanMovementRepository.create(paymentDetails);
    return this.rechargePlanMovementRepository.save(newMovement);
  }

  /**
   * Actualiza un plan de recarga existente.
   * @param id - ID del plan de recarga a actualizar.
   * @param updateRechargePlanDto - Datos para actualizar el plan.
   * @returns El plan de recarga actualizado.
   * @throws NotFoundException si el plan no se encuentra.
   */
  async actualizarPlan(
    id: number,
    updateRechargePlanDto: UpdateRechargePlanDto,
  ): Promise<RechargePlan> {
    const plan = await this.rechargePlanRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan de recarga con ID ${id} no encontrado`);
    }

    // Asigna los nuevos valores desde el DTO al plan existente
    Object.assign(plan, updateRechargePlanDto);

    // Guarda y retorna el plan actualizado
    return this.rechargePlanRepository.save(plan);
  }

  async findAllWithMessage(): Promise<{ message: string, plans: RechargePlan[] }> {
    const plans = await this.rechargePlanRepository.find();
    return {
      message: `Se encontraron ${plans.length} planes de recarga`,
      plans: plans
    };
  }

}
