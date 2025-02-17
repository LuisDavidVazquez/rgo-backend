import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './Enum/notification-type.enum';
import { SimsService } from '../sims/sims.service';
import { MailService } from '../Mail.service';
import { SmsService } from '../sms-notification/sms.service';
import { NotificationPreferencesService } from '../notification_preferences/notification_preferences.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @Inject(forwardRef(() => SimsService))
    private simsService: SimsService,
    private emailService: MailService,
    private smsService: SmsService,
    private notificationsPreferenceService: NotificationPreferencesService,
  ) {}

  async sendNotification(
    userId: number,
    message: string,
    type: string,
  ): Promise<void> {
    const preferences =
      await this.notificationsPreferenceService.findByUserId(userId);

    for (const preference of preferences) {
      if (preference.email) {
        await this.emailService.sendMail(
          preference.emailAddress,
          'Notificación',
          message,
        );
      }

      if (preference.sms) {
        await this.smsService.sendSms(preference.phoneNumber, message);
      }

      if (preference.portal) {
        await this.create({
          clientId: userId,
          type: validateNotificationType(type), // Alternativamente, si NotificationType es un enum o un tipo de unión, podrías considerar validar type antes de usarlo:
          message,
          createdAt: new Date(),
          data: { type, message },
        });
      }
    }
  }

  create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    return this.notificationsRepository.save(notification);
  }

  async findAll(clientId?: number) {
    let notifications;
    if (clientId) {
      notifications = await this.notificationsRepository.find({
        where: { clientId },
      });
    } else {
      notifications = await this.notificationsRepository.find();
    }

    // Verificar SIMs próximas a expirar
    try {
      const simsProximasAExpirar =
        await this.simsService.findSimsNearExpiration();
      for (const sim of simsProximasAExpirar) {
        try {
          await this.handleLineExpiration(
            sim.clientId, // Cambiar de string a number
            sim.iccid,
            sim.dueDate,
          );
        } catch (error) {
          console.error(
            `Error procesando notificación para SIM ${sim.iccid}:`,
            error,
          );
          // Continuar con el siguiente SIM en caso de error
        }
      }
    } catch (error) {
      console.error('Error al procesar SIMs próximas a expirar:', error);
    }

    // Obtener notificaciones actualizadas
    if (clientId) {
      return this.notificationsRepository.find({ where: { clientId } });
    }
    return this.notificationsRepository.find();
  }

  findOne(id: number) {
    return this.notificationsRepository.findOneBy({ id });
  }

  async markAsRead(id: number) {
    const notification = await this.notificationsRepository.findOneBy({ id });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.readAt = new Date();
    return this.notificationsRepository.save(notification);
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsRepository.update(id, updateNotificationDto);
  }

  async remove(id: number) {
    await this.notificationsRepository.delete(id);
  }

  //  async handleLineExpiration(distributorId: number, iccid: string, expirationDate: Date) {
  //    const sim = await this.simsService.findOne(iccid);
  //    const message = `La línea del cliente ${sim.client} con ICCID ${iccid} expirará el ${expirationDate.toLocaleDateString()}.`;

  //    await this.notificationsRepository.save({
  //      clientId: distributorId,
  //      type: NotificationType.LINE_EXPIRATION,
  //      message,
  //      createdAt: new Date(),
  //      expiresAt: expirationDate,
  //      data: { iccid, expirationDate, clientName: sim.client },
  //    });
  //  }

  async handleInvoiceDue(
    clientId: number,
    invoiceId: string,
    dueDate: Date,
    amount: number,
  ) {
    const message = `La factura ${invoiceId} por $${amount} vence el ${dueDate.toLocaleDateString()}.`;
    await this.notificationsRepository.create({
      clientId,
      type: NotificationType.INVOICE_DUE,
      message,
      data: { invoiceId, dueDate, amount },
    });
  }

  async handleSimAssignment(
    clientId: number,
    simId: string,
    phoneNumber: string,
  ) {
    const message = `Se ha asignado la SIM ${simId} al número ${phoneNumber}.`;
    await this.notificationsRepository.create({
      clientId,
      type: NotificationType.SIM_ASSIGNMENT,
      message,
      data: { simId, phoneNumber },
    });
  }

  async handleAccountUpdate(clientId: number, updateType: string) {
    const message = `Se ha actualizado su cuenta: ${updateType}.`;
    await this.notificationsRepository.create({
      clientId,
      type: NotificationType.ACCOUNT_UPDATE,
      message,
      data: { updateType },
    });
  }

  async getNotificationHistory(
    clientId: number,
    limit: number = 50,
  ): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async handleLineExpiration(
    clientId: number,
    iccid: string,
    expirationDate: Date,
  ) {
    try {
      const sim = await this.simsService.findOne(iccid);

      if (!sim) {
        throw new NotFoundException(`No se encontró SIM con ICCID ${iccid}`);
      }

      const notification = this.notificationsRepository.create({
        clientId,
        message: `La línea con ICCID ${iccid} está por expirar el ${expirationDate.toLocaleDateString()}`,
        type: NotificationType.LINE_EXPIRATION,
        status: 'PENDING',
        data: {
          iccid,
          expirationDate,
          clientName: sim.client,
        },
        createdAt: new Date(),
      });

      return await this.notificationsRepository.save(notification);
    } catch (error) {
      console.error('Error en handleLineExpiration:', error);
      throw error;
    }
  }
}

function validateNotificationType(type: string): NotificationType {
  if (Object.values(NotificationType).includes(type as NotificationType)) {
    return type as NotificationType;
  }
  throw new Error(`Tipo de notificación inválido: ${type}`);
}
