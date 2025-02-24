import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiscalDetailsService } from './fiscal_details.service';
import { UpdateFiscalDetailDto } from './dto/update-fiscal_detail.dto';
import { ApiBody, ApiResponse, ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateFiscalDetailDto } from './dto/create-fiscal_detail.dto';

@ApiTags('Datos Fiscales')
@Controller('fiscal-details')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class FiscalDetailsController {
  constructor(private readonly fiscalDetailsService: FiscalDetailsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear datos fiscales',
    description: `
      Crea un nuevo registro de datos fiscales.
      
      Validaciones:
      - RFC con formato válido (13 caracteres para personas físicas, 12 para morales)
      - Tipo de persona: FISICA o MORAL
      - Campos opcionales con formato específico del SAT
      - Relación con cliente existente (si se proporciona clientId)
      
      Reglas de negocio:
      - Un cliente puede tener múltiples datos fiscales
      - El RFC debe ser único por cliente
      - Se validan los catálogos del SAT para regímenes y usos de CFDI
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Datos fiscales creados exitosamente',
    type: CreateFiscalDetailDto
  })
  @ApiBody({
    type: CreateFiscalDetailDto,
    examples: {
      datos_fiscales: {
        value: {
          personType: 'FISICA',
          rfc: 'XAXX010101000',
          businessName: 'Empresa Ejemplo',
          fiscalRegime: '601',
          cdfiUsage: 'G03',
          clientId: 1
        }
      }
    }
  })
  create(@Body() createFiscalDetailDto: CreateFiscalDetailDto) {
    return this.fiscalDetailsService.create(createFiscalDetailDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los datos fiscales',
    description: `
      Retorna lista completa de datos fiscales registrados.
      
      Información incluida:
      - Datos de identificación fiscal
      - Información de facturación
      - Relaciones con clientes
      - Configuraciones de pago
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de datos fiscales encontrada exitosamente',
    type: [CreateFiscalDetailDto]
  })
  findAll() {
    return this.fiscalDetailsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener datos fiscales por ID',
    description: 'Busca y retorna datos fiscales específicos por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Datos fiscales encontrados exitosamente',
    type: CreateFiscalDetailDto
  })
  findOne(@Param('id') id: string) {
    return this.fiscalDetailsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar datos fiscales',
    description: `
      Actualiza datos fiscales existentes.
      
      Campos actualizables:
      - Régimen fiscal
      - Uso de CFDI
      - Métodos de pago
      - Datos de contacto
      
      Restricciones:
      - No se puede modificar el RFC
      - Validaciones SAT aplicadas
      - Mantiene historial de cambios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Datos fiscales actualizados exitosamente',
    type: UpdateFiscalDetailDto
  })
  update(@Param('id') id: string, @Body() updateFiscalDetailDto: UpdateFiscalDetailDto) {
    return this.fiscalDetailsService.update(+id, updateFiscalDetailDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar datos fiscales',
    description: `
      Elimina registro de datos fiscales.
      
      Consideraciones:
      - Verificación de dependencias
      - Registro de eliminación
      - Actualización de relaciones
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Datos fiscales eliminados exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.fiscalDetailsService.remove(+id);
  }

  @Get('by-client/:id')
  @ApiOperation({
    summary: 'Obtener datos fiscales por cliente',
    description: `
      Busca datos fiscales asociados a un cliente específico.
      
      Detalles incluidos:
      - Información fiscal completa
      - Configuraciones de facturación
      - Historial de actualizaciones
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Datos fiscales del cliente encontrados exitosamente',
    type: CreateFiscalDetailDto
  })
  findByClient(@Param('id') id: string) {
    return this.fiscalDetailsService.findByClient(+id);
  }
}

