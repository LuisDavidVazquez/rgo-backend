import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        // Personalizar el mensaje según el error
        let message = 'Error en la base de datos';
        if (exception.message.includes('column Sim.clientId does not exist')) {
            message = 'Error: El campo clientId ha sido actualizado a distributorId. Por favor, actualice su consulta.';
        }

        response
            .status(HttpStatus.BAD_REQUEST)
            .json({
                statusCode: HttpStatus.BAD_REQUEST,
                message,
                error: 'Bad Request',
                details: process.env.NODE_ENV === 'development' ? exception.message : undefined
            });
    }
}
