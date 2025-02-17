import { Module } from '@nestjs/common';
import { MailService } from './Mail.service';      

@Module({
  providers: [MailService],
  exports: [MailService], // Exporta MailService para que otros módulos puedan usarlo  
})
export class MailModule {}