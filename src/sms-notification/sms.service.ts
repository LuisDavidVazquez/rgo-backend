import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendSms(to: string, message: string): Promise<void> {
    // Implementa la lógica para enviar SMS aquí
    // console.log(`Enviando SMS a ${to}: ${message}`);
  }
}