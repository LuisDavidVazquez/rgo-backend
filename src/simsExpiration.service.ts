import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { SimsService } from './sims/sims.service';
import { NotificationType } from './notifications/Enum/notification-type.enum';

@Injectable()
export class LineExpirationService {
  constructor(
    private notificationsService: NotificationsService,
    private simsService: SimsService,
  ) {}

  async checkExpiringLines() {
    const expiringLines = await this.simsService.findAll(); // Obtiene líneas que vencen en 7 días
    
    for (const sim of expiringLines) {
      await this.notificationsService.create({
        clientId: sim.clientId,
        type: NotificationType.LINE_EXPIRING_SOON,
        message: `La línea de ${sim.client} vencerá el ${sim.dueDate.toLocaleDateString()}`,
      });
    }
  }
}
