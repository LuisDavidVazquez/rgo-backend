import { Injectable } from '@nestjs/common';
import { CreateClientRegistrationRequestDto } from './dto/create-client_registration_request.dto';
import { UpdateClientRegistrationRequestDto } from './dto/update-client_registration_request.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRegistrationRequest } from './entities/client_registration_request.entity';

@Injectable()
export class ClientRegistrationRequestsService {
  constructor(
    @InjectRepository(ClientRegistrationRequest)
    private clientRegistrationRequestRepository: Repository<ClientRegistrationRequest>,
  ) {}

  async create(createClientRegistrationRequestDto: CreateClientRegistrationRequestDto): Promise<ClientRegistrationRequest> {
    try {
      // Verificar que todos los campos requeridos estén presentes
      // console.log('Datos recibidos:', createClientRegistrationRequestDto);

      // Crear la solicitud con estado pendiente por defecto
      const clientRegistrationRequest = this.clientRegistrationRequestRepository.create({
        ...createClientRegistrationRequestDto,
        requestStatus: 'PENDIENTE' // Asignar estado por defecto
      });

      // Intentar guardar y loguear el resultado
      const savedRequest = await this.clientRegistrationRequestRepository.save(clientRegistrationRequest);
      // console.log('Solicitud guardada:', savedRequest);

      if (!savedRequest) {
        throw new Error('No se pudo guardar la solicitud en la base de datos');
      }

      return savedRequest;

    } catch (error) {
      console.error('Error detallado al crear la solicitud:', {
        message: error.message,
        stack: error.stack,
        detail: error.detail // Para errores de BD
      });
      
      // Verificar si es un error de validación
      if (error.code === '23505') { // Código para violación de uniqueness
        throw new Error('Ya existe una solicitud con este correo electrónico');
      }

      throw new Error(`Error al crear la solicitud: ${error.message}`);
    }
  }

  async findAll(): Promise<ClientRegistrationRequest[]> {
    try {
      const requests = await this.clientRegistrationRequestRepository.find();
      // console.log('Solicitudes encontradas:', requests);
      return requests;
    } catch (error) {
      console.error('Error al obtener todas las solicitudes:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ClientRegistrationRequest> {
    return this.clientRegistrationRequestRepository.findOneBy({ id });
  }

  async update(id: number, updateClientRegistrationRequestDto: UpdateClientRegistrationRequestDto): Promise<ClientRegistrationRequest> {
    await this.clientRegistrationRequestRepository.update(id, updateClientRegistrationRequestDto);
    return this.clientRegistrationRequestRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.clientRegistrationRequestRepository.delete(id);
    return result; // Devuelve el resultado que incluye el número de filas afectadas
  }
}
