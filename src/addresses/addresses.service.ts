import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { getEstados, getMunicipios } from './resource/estadosMuniciosMx';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    const newAddress = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(newAddress);
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.addressRepository.delete(id);
      if (result.affected === 0) {
        throw new Error(
          `No se encontró la dirección con ID ${id} o no se pudo eliminar.`,
        );
      }
    } catch (error) {
      throw new Error(`Error al eliminar la dirección: ${error.message}`);
    }
  }

  async getEstados() {
    return getEstados();
  }

  async getMunicipios(estado: string) {
    if (!estado) {
      throw new Error('El estado es requerido');
    }
    return getMunicipios(estado.toLocaleLowerCase());
  }
}
