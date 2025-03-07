import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { FiscalDetail } from 'src/fiscal_details/entities/fiscal_detail.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ActionLogsService } from 'src/action_logs/action_logs.service';
import { MailService } from 'src/Mail.service';
import { Sim } from 'src/sims/entities/sim.entity';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateFiscalDetailDto } from 'src/fiscal_details/dto/create-fiscal_detail.dto';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { In } from 'typeorm';
import { ClientIccidsService } from 'src/client_iccids/client_iccids.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private repo: Repository<Client>,
    @InjectRepository(FiscalDetail)
    private fiscalDetailRepository: Repository<FiscalDetail>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private actionLogService: ActionLogsService,
    private mailService: MailService,
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    private httpService: HttpService,
    @InjectRepository(ClientIccid)
    private clientIccidRepository: Repository<ClientIccid>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }
  // const winnCreateUrl = 'https://plataformasconnectivity.qasar.app/account/winn-create'; // Ajusta esta URL según sea necesario

  async create(createDto: CreateClientDto, addressDTO: CreateAddressDto, fiscalDetailDTO: CreateFiscalDetailDto): Promise<Client> {
    //  const { name, phone, email, password, clientLevel, street, postalCode, state, city, personType, 
    //rfc, isFiscalData, country, neighborhood, number, innerNumber, externalNumber, businessName,
    //fiscalRegime, cdfiUsage, paymentMethod, paymentForm, paymentCurrency  } = createDto;

    try {

      // const address = new Address()
      //address.street = street
      //address.postalCode = postalCode
      //address.state = state
      //address.city = city
      //address.isFiscalData = isFiscalData
      //address.country = country
      //address.neighborhood = neighborhood
      //address.number = number
      //address.innerNumber = innerNumber
      //address.externalNumber = externalNumber
      //{calle:calle, codigoPostal:codigoPostal, estado:estado,municipio:municipio}

      // const fiscalDetail = new FiscalDetail()
      //fiscalDetail.personType = personType
      //fiscalDetail.rfc = rfc
      //fiscalDetail.businessName = businessName
      //fiscalDetail.fiscalRegime = fiscalRegime
      //fiscalDetail.cdfiUsage = cdfiUsage
      //fiscalDetail.paymentMethod = paymentMethod
      //fiscalDetail.paymentForm = paymentForm
      //fiscalDetail.paymentCurrency = paymentCurrency


      // Guarda primero los datos fiscales y dirección


      //createDatosfiscalesDTO={tipoPersona:tipoPersona, rfc:rfc}


      // Obtén el rol y su permiso asociado
      // Buscar el rol de cliente y sus permisos
      const clientRole = await this.roleRepository.findOne({
        where: { name: 'distribuidor' },
        relations: ['permission']
      });

      // Verificar si existe el rol y sus permisos
      if (!clientRole) {
        throw new ConflictException('El rol de cliente no fue encontrado');
      }

      if (!clientRole.permission) {
        throw new ConflictException('El rol de cliente no tiene permisos asignados');
      }

      // const datosFiscales = await this.datosFiscalesRepository.findOne({ where: { id: datosFiscalesId } });
      // const direccion = await this.direccionesRepository.findOne({ where: { id: direccionId } });

      if (!fiscalDetailDTO || !addressDTO) {
        throw new NotFoundException('DatosFiscales or Direccione not found.');
      }

      console.log(fiscalDetailDTO, 'estos son los datos fiscales')
      console.log(addressDTO, 'esta es la direccione')


      // Crea el registro del cliente en tu base de datos local
      const hashedPassword = await bcrypt.hash(createDto.password, 10);

      const cliente = this.repo.create(<DeepPartial<Client>>{
        name: createDto.name,
        email: createDto.email,
        phone: createDto.phone,
        password: hashedPassword,
        clientLevel: createDto.clientLevel || '2',
        // externalId: externalIdFromQuasar, // Utiliza el externalId de Quasar para el registro local
        externalPlatformId: 1,
        permission: clientRole.permission.value, // Asigna el nombre del permiso

        fiscalDetail: fiscalDetailDTO,  // Set the datosFiscalesId
        address: addressDTO,  // Set the direccionId
        IsActive: true,


      });
      console.log(clientRole.permission.value, 'este es el permiso')

      // Guarda el cliente en la base de datos
      const clienteCreado = await this.repo.save(cliente);

      fiscalDetailDTO.clientId = clienteCreado.id;
      await this.fiscalDetailRepository.save(fiscalDetailDTO);
      addressDTO.clientId = clienteCreado.id;
      await this.addressRepository.save(addressDTO);

      //  // Envío del correo con la contraseña
      //  await this.mailService.sendMail(email, "Bienvenido a Nuestro Servicio", `Su nueva contraseña es: ${password}`);


      // Asignar el rol de distribuidor

      //      // Asignar el rol 'distribuidor' al nuevo cliente
      // const distribuidorRole = await this.roleRepository.findOneBy({ name: 'distribuidor' });
      // // console.log(distribuidorRole,'esto es lo que trae distribuidorRole');  
      // // Asegurarse de que el rol existe y tiene permisos
      // if (!distribuidorRole) {
      //     console.error('Distributor role not found');
      //     throw new ConflictException('Required role is not available.');
      // }

      // Crear una nueva UserRole para asociar al cliente con el rol y sus permisos
      const newUserRole = this.userRoleRepository.create({
        client: clienteCreado, // referencia directa al cliente
        role: clientRole, // referencia directa al rol, que ya debería tener permisos
        roleType: 'client' // Aquí aseguras que roleType tiene un valor
      });
      console.log(newUserRole, 'este es newUserRole')
      // Guardar la UserRole que crea la conexión entre el cliente, el rol y los permisos
      await this.userRoleRepository.save(newUserRole);

      // Devolver el cliente creado con el rol y permisos asociados
      //return clienteCreado;



      // Registra la acción de creación en la bitácora
      await this.actionLogService.logAction(
        'CREAR_CLIENTE',
        clienteCreado.id,
        `Nuevo cliente creado en Rastreogo: ${clienteCreado.email}`
      );

      const subject = '¡Bienvenido a Rastreo Go!';
      const text = `Hola ${createDto.name}, Tu cuenta como distribuidor ha sido creada con éxito en Rastreo Go. Tu contraseña es:
       ${createDto.password} Ya puedes iniciar sesión en ${process.env.LOGIN_URL}, y comenzar a gestionar tus servicios de conectividad. 
       Si necesitas asistencia, no dudes en contactarnos. Saludos,El equipo de Rastreo Go`;
      await this.mailService.sendMail(createDto.email, subject, text);

      return clienteCreado;
    } catch (error) {
      console.error('Error durante el registro en Rastreogo:', error.response?.data || error.message);
      throw new ConflictException('Error al procesar el registro con Rastreogo.');
    }
  }
  //}
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async createSuperadmin(createDto: CreateClientDto): Promise<Client & { message: string }> {
    const { name, phone, email, password, clientLevel } = createDto;

    try {
      // Primero obtener el rol con su permiso usando leftJoinAndSelect
      const superadminRole = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permission', 'permission')
        .where('role.name = :name', { name: 'superadministrador' })
        .getOne();

      // console.log('Rol con permisos:', superadminRole); // Para debugging

      // Verifica si el rol y su permiso existen
      if (!superadminRole || !superadminRole.permission) {
        throw new ConflictException('Rol de superadministrador o permiso no encontrado');
      }

      // Crea el registro del cliente con el permiso asignado
      const hashedPassword = await bcrypt.hash(password, 10);
      const cliente = this.repo.create(<DeepPartial<Client>>{
        email,
        name,
        phone,
        password: hashedPassword,
        clientLevel: clientLevel || '1',
        permission: superadminRole.permission.value, // Ahora sí tendremos acceso al valor del permiso
        IsActive: true
      });

      const clienteCreado = await this.repo.save(cliente);

      // Crear una nueva UserRole para asociar al cliente con el rol y sus permisos
      const newUserRole = this.userRoleRepository.create({
        client: clienteCreado,
        role: superadminRole,
        roleType: 'superadministrador'
      });

      await this.userRoleRepository.save(newUserRole);

      // Registro en bitácora
      await this.actionLogService.logAction(
        'CREAR_CLIENTE',
        clienteCreado.id,
        `este usuario es un superadministrador: ${clienteCreado.email}`
      );

      // Enviar mensaje de éxito
      const subject = '¡Bienvenido a Rastreo Go!';
      const text = `Hola ${name}, tu cuenta de superadministrador ha sido creada exitosamente en Rastreo Go. Tu contraseña es: ${password} Ya puedes iniciar sesión en ${process.env.LOGIN_URL}, y comenzar a gestionar tus servicios de conectividad. 
      Si necesitas asistencia, no dudes en contactarnos. Saludos,El equipo de Rastreo Go`;
      await this.mailService.sendMail(email, subject, text);

      return {
        ...clienteCreado,
        message: 'El usuario superadministrador se ha creado exitosamente'
      };

    } catch (error) {
      console.error('Error durante el registro ', error.response?.data || error.message);
      throw new ConflictException('Error al procesar el registro.');
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async createVentas(createDto: CreateClientDto): Promise<Client & { message: string }> {
    const { name, phone, email, password, clientLevel } = createDto;

    try {
      // Obtén el rol y su permiso asociado usando queryBuilder
      const ventasRole = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permission', 'permission')
        .where('role.name = :name', { name: 'ventas' })
        .getOne();

      // console.log('Rol de ventas con permisos:', ventasRole); // Para debugging

      // Verifica si el rol y su permiso existen
      if (!ventasRole || !ventasRole.permission) {
        throw new ConflictException('Rol de ventas o permiso no encontrado');
      }

      // Crea el registro del cliente con el permiso asignado
      const hashedPassword = await bcrypt.hash(password, 10);
      const cliente = this.repo.create(<DeepPartial<Client>>{
        email,
        name,
        phone,
        password: hashedPassword,
        clientLevel: clientLevel || '4',
        externalPlatformId: 1,
        permission: ventasRole.permission.value, // Ahora sí tendremos acceso al valor del permiso
        IsActive: true
      });

      const clienteCreado = await this.repo.save(cliente);

      // Crear una nueva UserRole
      const newUserRole = this.userRoleRepository.create({
        client: clienteCreado,
        role: ventasRole,
        roleType: 'ventas'
      });

      await this.userRoleRepository.save(newUserRole);

      // Registrar la acción
      await this.actionLogService.logAction(
        'CREAR_CLIENTE',
        clienteCreado.id,
        `Nuevo usuario de ventas creado: ${clienteCreado.email}`
      );
      
       // Enviar mensaje de éxito
       const subject = '¡Bienvenido a Rastreo Go!';
       const text = `Hola ${name}, tu cuenta de ventas ha sido creada exitosamente en Rastreo Go. Tu contraseña es: ${password} Ya puedes iniciar sesión en ${process.env.LOGIN_URL}, y comenzar a gestionar tus servicios de conectividad. 
       Si necesitas asistencia, no dudes en contactarnos. Saludos,El equipo de Rastreo Go`;
       await this.mailService.sendMail(email, subject, text);
      return {
        ...clienteCreado,
        message: 'El usuario de ventas se ha creado exitosamente'
      };
    } catch (error) {
      console.error('Error durante el registro de ventas:', error);
      throw new ConflictException('Error al procesar el registro de usuario de ventas.');
    }
  }
  //////////////////////////////////////////////////////////////////////////////

  async createAdministracion(createDto: CreateClientDto): Promise<Client & { message: string }> {
    // Verificar si ya existe un registro con el mismo ID o email
    const existingCliente = await this.repo.findOne({
      where: [
        // { id: createDto.id },  // Si estás proporcionando un ID
        { email: createDto.email }  // O si el email debe ser único
      ]
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente con este ID o email');
    }

    const { name, phone, email, password, clientLevel } = createDto;


    // Obtén el rol y su permiso asociado
    const distribuidorRole = await this.roleRepository.findOne({
      where: { name: 'administración' },
      relations: ['permission'] // Carga la relación 'permission'
    });

    // Verifica si el rol de distribuidor y su permiso existen
    if (!distribuidorRole || !distribuidorRole.permission) {
      throw new ConflictException('Distributor role or permission not found.');
    }


    // Crea el registro del cliente en tu base de datos local
    const hashedPassword = await bcrypt.hash(password, 10);
    const cliente = this.repo.create(<DeepPartial<Client>>{
      email,
      name,
      phone,
      password: hashedPassword,
      clientLevel: clientLevel || '5',
      // reference,
      // externalId: externalIdFromQuasar, // Utiliza el externalId de Quasar para el registro local
      externalPlatformId: 1,
      permission: distribuidorRole.permission.value, // Asigna el nombre del permiso
      isActive: true,


    });

    // Guarda el cliente en la base de datos
    const clienteCreado = await this.repo.save(cliente);

    // Asignar el rol de distribuidor

    //      // Asignar el rol 'distribuidor' al nuevo cliente
    // const distribuidorRole = await this.roleRepository.findOneBy({ name: 'distribuidor' });
    // // console.log(distribuidorRole,'esto es lo que trae distribuidorRole');  
    // // Asegurarse de que el rol existe y tiene permisos
    // if (!distribuidorRole) {
    //     console.error('Distributor role not found');
    //     throw new ConflictException('Required role is not available.');
    // }

    // Crear una nueva UserRole para asociar al cliente con el rol y sus permisos
    const newUserRole = this.userRoleRepository.create({
      client: clienteCreado, // referencia directa al cliente
      role: distribuidorRole, // referencia directa al rol, que ya debería tener permisos
      roleType: 'administración' // Aquí aseguras que roleType tiene un valor
    });
    console.log(newUserRole, 'este es newUserRole')
    // Guardar la UserRole que crea la conexión entre el cliente, el rol y los permisos
    await this.userRoleRepository.save(newUserRole);

    // Devolver el cliente creado con el rol y permisos asociados
    //return clienteCreado;



    // Registra la acción de creación en la bitácora
    await this.actionLogService.logAction(
      'CREAR_CLIENTE',
      clienteCreado.id,
      `Nuevo cliente creado en Rastreogo: ${clienteCreado.email}`
    );

    ///////////////////////////////////////////////////////
    // Log y retorno de usuario creado 
    await this.actionLogService.logAction(
      'CREATE_USER',
      clienteCreado.id,
      `Nuevo usuario creado: ${clienteCreado.email}`
    );


 // Enviar mensaje de éxito
 const subject = '¡Bienvenido a Rastreo Go!';
 const text = `Hola ${name}, tu cuenta de administración ha sido creada exitosamente en Rastreo Go. Tu contraseña es: ${password} Ya puedes iniciar sesión en ${process.env.LOGIN_URL}, y comenzar a gestionar tus servicios de conectividad. 
 Si necesitas asistencia, no dudes en contactarnos. Saludos,El equipo de Rastreo Go`;
 await this.mailService.sendMail(email, subject, text);



    return {
      ...clienteCreado,
      message: 'El usuario de administración se ha creado exitosamente'
    };
  }

/////////////////////////////////////////////////////////////////////////////







////////////////////////////////////////////////////////////////////////////////

  async removeFiscalDetail(clientId: number): Promise<void> {
    const cliente = await this.repo.findOne({
      where: { id: clientId },
      relations: ['fiscalDetails']
    });
    if (cliente && cliente.fiscalDetails) {
      await this.fiscalDetailRepository.delete(cliente.fiscalDetails[0].id);
      cliente.fiscalDetails = [];
      await this.repo.save(cliente);
    }
  }

  async removeAddress(clientId: number): Promise<void> {
    const cliente = await this.repo.findOne({
      where: { id: clientId },
      relations: ['addresses']
    });
    if (cliente && cliente.addresses) {
      await this.addressRepository.delete(cliente.addresses[0].id);
      cliente.addresses = [];
      await this.repo.save(cliente);
    }
  }

  async removeCliente(clienteId: number): Promise<void> {
    await this.repo.delete(clienteId);
  }

  /////////////////////////////////////////////////////////////////
  async getSimsByClientId(clientId: number): Promise<Sim[]> {
    // console.log('estos son los sims', clientId);
    try {
      const sims = await this.simRepository

        .createQueryBuilder('sims')
        .where('sims.clientId = :clientId', { clientId })
        .select([
          'sims.id',
          'sims.status',
          'sims.clientId',
          'sims.client',
          'sims.name',
          'sims.days',
          'sims.paidDate',
          'sims.dueDate',
          'sims.rechargePlanId',
          'sims.planName',
          'sims.iccid',
          'sims.imsi',
          'sims.msisdn',
          'sims.activationDate',
          'sims.lastStatusUpdate',
          'sims.createdAt',
          'sims.updatedAt'
        ])

        .getMany();
      // console.log(sims, 'estos son los sims');
      return sims;
    } catch (error) {
      // console.log(error, 'estos son los errores');
    }
  }


  async getClientIccidsByClient(clientId: number): Promise<ClientIccid[]> {
    const client = await this.repo.findOne({
      where: { id: clientId },
      relations: ['users'],
    });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${clientId} no encontrado.`);
    }

    const userIds = client.users.map(user => user.id);

    if (userIds.length === 0) {
      return []; // Retorna un array vacío si no hay usuarios asociados
    }




    //         // Obtener los distributorIds de los usuarios asociados
    // const sims = await this.simRepository.find({
    //   where: { distributorId: In(userIds), clienteRastreoGoId: clienteRastreoGoId },
    // });
    /////////////////////////////////////////////////////////////////////////////////

    const clientIccids = await this.clientIccidRepository.find({
      where: { user: { id: In(userIds) } },
      relations: ['user'],
    });

    // Obtener los distributorIds de los usuarios asociados
    // const sims = await this.simRepository.find({
    //   where: { distributorId: In(userIds), clienteRastreoGoId: clienteRastreoGoId },
    // });

    return clientIccids;
  }


  async getSimsByClienteRastreoGo(clientId: number): Promise<{ clientIccids: ClientIccid[], sims: Sim[] }> {
    const clienteRastreoGo = await this.repo.findOne({
      where: { id: clientId },
      relations: ['users'],
    });

    if (!clienteRastreoGo) {
      throw new NotFoundException(`ClienteRastreoGo con ID ${clientId} no encontrado.`);
    }

    const userIds = clienteRastreoGo.users
      .filter(user => user) // Filtra los users que no son nulos
      .map(user => user.id);


    if (userIds.length === 0) {
      return { clientIccids: [], sims: [] }; // Retorna arrays vacíos si no hay usuarios asociados
    }

    const clientIccids = await this.clientIccidRepository.find({
      where: { user: { id: In(userIds) } },
      relations: ['user'],
    });

    const sims = await this.simRepository.find({
      where: { client: In(userIds) },
    });

    return { clientIccids, sims };
  }

  async findByName(name: string): Promise<Client[]> {
    return await this.repo.find({ where: { name } });
  }


  //Búsqueda por Coincidencia Parcial

  //Si deseas realizar una búsqueda más flexible (como una búsqueda que 
  //coincida parcialmente con el nombre), podrías usar el operador Like de TypeORM

  //async findByName(name: string): Promise<ClientesRastreoGo[]> {
  //    return await this.repo.find({ where: { name: Like(`%${name}%`) } });
  //  }


  async findAll(): Promise<Client[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Client> {
    const cliente = await this.repo.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }
    return cliente;
  }


  async findOneByEmail(email: string): Promise<Client | undefined> {
    return this.repo.findOne({ where: { email } });
  }
  //findAll() {
  //  return `This action returns all clientesRastreoGo`;
  //}

  //findOne(id: number) {
  //  return `This action returns a #${id} clientesRastreoGo`;
  // }

  update(id: number, updateClientDto: UpdateClientDto) {
    return this.repo.update(id, updateClientDto);
  }

  updatePassword(id: number, updateClientDto: UpdateClientDto) {
    return this.repo.update(id, updateClientDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID "${id}" no encontrado.`);
    }
    return {
      message: `El cliente con ID ${id} ha sido eliminado exitosamente`
    };
  }

  // Método nuevo para obtener usuarios por distributorId
  async getUsersByDistributorId(clientId: number): Promise<User[]> {
    try {
      return this.userRepository.find({
        where: { clientId: clientId },
        select: ['id', 'username', 'email', 'phone'], // Selecciona los campos que necesitas
      });
    } catch (error) {
      console.error(error, 'estos son los errores');
      return [];
    }
  }


  // Nuevo método para obtener el estado de las SIMs de los usuarios
  async getUserWithSimStatus(clientId: number): Promise<any[]> {
    const users = await this.userRepository.find({
      where: { clientId: clientId },
      select: ['id', 'username', 'email', 'phone', 'clientId'],
      relations: ['clientIccids', 'clientIccids.sims'],
    });

    return Promise.all(users.map(async (user) => {
      // Llamar a toJSON() para desencriptar los datos del usuario
      const decryptedUser = user.toJSON();

      const simStatuses = user.clientIccids.map(clientIccid => ({
        id: clientIccid.sims[0]?.id,
        iccid: clientIccid.iccid,
        status: clientIccid.sims[0]?.status || 'No encontrado',
        dueDate: clientIccid.sims[0]?.dueDate,
        name: clientIccid.sims[0]?.name,
        planName: clientIccid.sims[0]?.planName,
        gps: clientIccid.gps,
        imei: clientIccid.imei,
        activationDate: clientIccid.sims[0]?.activationDate,
        lastStatusUpdate: clientIccid.sims[0]?.lastStatusUpdate,
        createdAt: clientIccid.sims[0]?.createdAt,
        updatedAt: clientIccid.sims[0]?.updatedAt,
      }));

      return {
        ...decryptedUser, // Usar los datos desencriptados
        sims: simStatuses,
        totalSims: simStatuses.length
      };
    }));
  }



  async findOneWithDetails(id: number): Promise<Client> {
    console.log(id, 'este es el id')
    try {
      const cliente = await this.repo.findOne({
        where: { id },
        relations: ['fiscalDetails', 'addresses']
      });
      console.log(cliente, 'este es el cliente con detalles')
      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
      }
      return cliente;
    } catch (error) {
      console.error('Error al obtener el cliente con detalles:', error);
      throw new Error('No se pudo obtener el cliente con detalles');
    }
  }
  /////////////////////metodo para obtener todas las sims
  async getAllSims(): Promise<Sim[]> {
    const sims = await this.simRepository.find();

    if (!sims.length) {
      throw new NotFoundException('No se encontraron SIMs en la base de datos.');
    }

    return sims;
  }
//////////////////////////todavia falta la vista del front por eso no tiene level
async createSoporte(createDto: CreateClientDto): Promise<Client & { message: string }> {
  const { name, phone, email, password, clientLevel } = createDto;

    try {
      // Obtén el rol y su permiso asociado usando queryBuilder
      const soporteRole = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permission', 'permission')
        .where('role.name = :name', { name: 'soporte' })
        .getOne();

      // console.log('Rol de soporte con permisos:', soporteRole);

      // Verifica si el rol y su permiso existen
      if (!soporteRole || !soporteRole.permission) {
        throw new ConflictException('Rol de soporte o permiso no encontrado');
      }

      // Crea el registro del cliente con el permiso asignado
      const hashedPassword = await bcrypt.hash(password, 10);
      const cliente = this.repo.create(<DeepPartial<Client>>{
        email,
        name,
        phone,
        password: hashedPassword,
        clientLevel: clientLevel || '0', // Nivel específico para soporte
        externalPlatformId: 1,
        permission: soporteRole.permission.value,
        IsActive: true
      });

      const clienteCreado = await this.repo.save(cliente);

      // Crear una nueva UserRole
      const newUserRole = this.userRoleRepository.create({
        client: clienteCreado,
        role: soporteRole,
        roleType: 'soporte'
      });

      await this.userRoleRepository.save(newUserRole);

      // Registrar la acción
      await this.actionLogService.logAction(
        'CREAR_CLIENTE',
        clienteCreado.id,
        `Nuevo usuario de soporte creado: ${clienteCreado.email}`
      );

      // Enviar mensaje de éxito
      const subject = '¡Bienvenido a Rastreo Go!';
      const text = `Hola ${name}, tu cuenta de soporte ha sido creada exitosamente en Rastreo Go. Tu contraseña es: ${password} Ya puedes iniciar sesión en ${process.env.LOGIN_URL}, y comenzar a gestionar tus servicios de conectividad. 
      Si necesitas asistencia, no dudes en contactarnos. Saludos,El equipo de Rastreo Go`;
      await this.mailService.sendMail(email, subject, text);

      return {
        ...clienteCreado,
        message: 'El usuario de soporte se ha creado exitosamente'
      };    } catch (error) {
      console.error('Error durante el registro de soporte:', error);
      throw new ConflictException('Error al procesar el registro de usuario de soporte.');
    }
  }

  async getDatabaseStats(): Promise<{
    success: boolean;
    message: string;
    stats: {
      totalClients: number;
      //totalSims: number;
      clientsByRole: {
        superadmin: number;
        distribuidor: number;
        ventas: number;
        soporte: number;
        administracion: number;
      };
      activeSims: number;
      inactiveSims: number;
    };
    data: {
      clients: Client[];
      sims: Sim[];
      userRoles: UserRole[];
    };
  }> {
    try {
      // Obtener totales y estadísticas
      const totalClients = await this.repo.count();
      const totalSims = await this.simRepository.count();
      
      const clientsByRole = await this.userRoleRepository
        .createQueryBuilder('userRole')
        .select('userRole.roleType, COUNT(*)', 'count')
        .groupBy('userRole.roleType')
        .getRawMany();

      const activeSims = await this.simRepository.count({ 
        where: { status: 'activa' } 
      });

      // Obtener contenido de las tablas
      const clients = await this.repo.find({
        relations: ['fiscalDetails', 'addresses']
      });
      
      const sims = await this.simRepository.find({
        relations: ['client']
      });
      
      const userRoles = await this.userRoleRepository.find({
        relations: ['client', 'role']
      });
      
      return {
        success: true,
        message: `Estadísticas y contenido de la base de datos al ${new Date().toLocaleString()}`,
        stats: {
          totalClients,
       //   totalSims,
          clientsByRole: {
            superadmin: clientsByRole.find(r => r.roleType === 'superadministrador')?.count || 0,
            distribuidor: clientsByRole.find(r => r.roleType === 'distribuidor')?.count || 0,
            ventas: clientsByRole.find(r => r.roleType === 'ventas')?.count || 0,
            soporte: clientsByRole.find(r => r.roleType === 'soporte')?.count || 0,
            administracion: clientsByRole.find(r => r.roleType === 'administración')?.count || 0
          },
          activeSims,
          inactiveSims: totalSims - activeSims
        },
        data: {
          clients,
          sims,
          userRoles
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener estadísticas y datos');
    }
  }

  async requestPasswordReset(email: string) {
    // Buscar el cliente por email
    const client = await this.repo.findOne({ where: { email } });
    if (!client) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'Si el correo existe, recibirás instrucciones para restaurar tu contraseña' };
    }

    // Generar token JWT con expiración de 1 hora
    const token = this.jwtService.sign(
      { email: client.email, id: client.id },
      { expiresIn: '1h' }
    );

    try {
      // Enviar correo con el token
      await this.mailService.sendPasswordResetEmail(email, token);
      return { message: 'Correo de restauración enviado exitosamente' };
    } catch (error) {
      throw new Error('Error al enviar el correo de restauración');
    }
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    try {
      // Verificar y decodificar el token
      const decoded = this.jwtService.verify(token);
      
      // Buscar el cliente
      const client = await this.repo.findOne({ where: { email: decoded.email } });
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Actualizar la contraseña
      client.password = hashedPassword;
      await this.repo.save(client);

      // Registrar la acción
      await this.actionLogService.logAction(
        'RESET_PASSWORD',
        client.id,
        `Contraseña restaurada para: ${client.email}`
      );

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('El enlace de restauración ha expirado');
      }
      throw new Error('Error al restaurar la contraseña');
    }
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; message: string }> {
    try {
      // Verificar el token sin necesidad de un secret adicional
      const decoded = this.jwtService.verify(token);
      
      // Si llegamos aquí, el token es válido
      return { 
        valid: true, 
        message: 'Token válido' 
      };
    } catch (error) {
      // Manejo específico de errores
      if (error.name === 'TokenExpiredError') {
        return { 
          valid: false, 
          message: 'El enlace de restauración ha expirado' 
        };
      } else if (error.name === 'JsonWebTokenError') {
        return { 
          valid: false, 
          message: 'Token inválido o malformado' 
        };
      }
      
      // Otros errores
      return { 
        valid: false, 
        message: 'Error al verificar el token' 
      };
    }
  }
}