import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid'; // Importar la función para generar UUID v4
import { Client } from 'src/clients/entities/client.entity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Role } from 'src/roles/entities/role.entity';
import { MailService } from 'src/Mail.service';
import { ActionLogsService } from 'src/action_logs/action_logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private actionlog: ActionLogsService, // Inyectar BitacoraService aquí
    @InjectRepository(Client) // Agrega esta línea
    private clientRepository: Repository<Client>, // Asegúrate de que esto está correcto
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Repositorio de roles inyectado
    private mailService: MailService,
  ) {
    // Verificar que los repositorios están correctamente inyectados
    console.log('UserRepository:', !!this.userRepository);
    console.log('ClientRepository:', !!this.clientRepository);
  }

  async findByUsername(username: string) {
    try {
      const tempUser = new User();
      //  console.log(username,'estos son los datos del usuario encontrado');
      const usernameHash = tempUser.hashField(username);
      //  console.log(usernameHash,'estos son los datos del usuario encontrado');

      // Buscar el usuario
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username_hash = :hash', { hash: usernameHash })
        .getOne();

      // Verificar si se encontró el usuario
      if (!user) {
        throw new NotFoundException(
          `No se encontró un usuario con el username ${username}`,
        );
      }
      // console.log(user,'estos son los datos del usuario encontrado');

      // Convertir a una instancia de User para usar los métodos de la clase
      const userInstance = Object.assign(new User(), user);
      // console.log(userInstance,'estos son los datos del usuario encontrado');
      // Ahora sí, convertir a JSON con la instancia correcta
      return userInstance.toJSON();
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  }

  //lo que es usuario emmail password o token tiene que estar hasheado en su respetibos campos
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      let { username, phone, email, password, clientId, clientLevel } =
        createUserDto;

      // Validar campos requeridos
      if (!email || !username || !clientId) {
        throw new HttpException(
          'Email, username y clientId son campos requeridos',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar email en clients
      const existingClient = await this.clientRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingClient) {
        throw new HttpException(
          `El correo ${email} ya está registrado como distribuidor`,
          HttpStatus.CONFLICT,
        );
      }

      // Verificar email en users
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new HttpException(
          `El correo ${email} ya está registrado como usuario`,
          HttpStatus.CONFLICT,
        );
      }

      // Verificar cliente
      const cliente = await this.clientRepository.findOneBy({ id: clientId });
      if (!cliente) {
        throw new HttpException(
          `No se encontró el cliente con ID ${clientId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Continuar con la creación del usuario si el email no existe
      if (!password) {
        const randomPasswordLength = 8;
        password = randomBytes(randomPasswordLength)
          .toString('hex')
          .slice(0, randomPasswordLength);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // const hashedEmail = await bcrypt.hash(email, 10);
      // const hashedUsername = await bcrypt.hash(username, 10);
      // const hashedPhone = await bcrypt.hash(phone, 10);

      // Generar un externalId utilizando UUID
      // const externalId = uuidv4();
      console.log('Creating User with ExternalID ', hashedPassword);

      // Obtener rol de usuario
      const usuarioRole = await this.roleRepository.findOne({
        where: { name: 'usuario' },
        relations: ['permission'],
      });

      if (!usuarioRole || !usuarioRole.permission) {
        throw new NotFoundException(
          'El rol de usuario o el permiso asociado no está disponible',
        );
      }
      console.log(usuarioRole);

      // Crear el usuario utilizando el método create correctamente
      const user = this.userRepository.create({
        username: username,
        phone: phone,
        email: email,
        password: hashedPassword,
        clientLevel: clientLevel || '3',
        permission: usuarioRole.permission.value, // Asegurándose de usar una propiedad string
        IsActive: true,
        clientId: cliente.id, // Asegúrate de que estás usando el id del cliente correctamente
      });
      // const hashedClientlevel = await bcrypt.hash(clientlevel, 10);

      // console.log("ID Padre a guardar:", user.clientId);
      const savedUser = await this.userRepository.save(user); // Guardar el usuario
      //  console.log(savedUser, 'estos son los datos del usuario guardado');
      // // Envío del correo con la contraseña
      // await this.mailService.sendMail(email, "Bienvenido a Nuestro Servicio", `Su nueva contraseña es: ${password}`);

      // console.log(JSON.stringify(savedUser), 'saveuser');
      // Crear y guardar el UserRole para conectar el usuario con el rol
      const newUserRole = this.userRoleRepository.create({
        user: savedUser,
        role: usuarioRole,
        roleType: 'usuario', // Aquí aseguras que roleType tiene un valor
      });

      await this.userRoleRepository.save(newUserRole);

      // const newUserRole = this.userRoleRepository.create({
      //   userId: savedUser.id,
      //   roleid: defaultRole.id
      // });

      // await this.userRoleRepository.save(newUserRole);

      // Log y retorno de usuario creado
      await this.actionlog.logAction(
        'CREATE_USER',
        savedUser.id,
        `Nuevo usuario creado: ${savedUser.email}`,
      );

      // Enviar el correo con la contraseña al usuario

      const subject = '¡Tu cuenta en Rastreo Go está lista!';
      const text = `Hola ${username}: ¡Tu cuenta en Rastreo Go está lista! Tu contraseña es: ${password} 
      Ingresa ahora en ${process.env.LOGIN_URL}. Si tienes preguntas, estamos aquí para ayudarte.Saludos,
      El equipo de Rastreo Go`;
      await this.mailService.sendMail(email, subject, text);

      return savedUser;

      // console.log(user)
      // return this.repo.save(user);
    } catch (error) {
      // Si es un error HTTP personalizado, lo propagamos directamente
      if (error instanceof HttpException) {
        console.log('error instanceof HttpException', error);
        throw error;
      }

      // Si es un error de duplicado de la base de datos
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'El correo electrónico ya está registrado',
          HttpStatus.CONFLICT,
        );
      }

      // Error genérico
      throw new HttpException(
        'Ocurrió un error al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async resetSim(userId: number): Promise<void> {
    // Lógica para resetear la SIM del usuario
    // ...
    // Luego, registrar la acción en la bitácora
    await this.actionlog.logAction(
      'RESET_SIM',
      userId,
      'La SIM ha sido reseteada.',
    );
  }

  async powerOffDevice(userId: number, deviceId: number): Promise<void> {
    // Lógica para apagar el dispositivo
    // ...
    // Luego, registrar la acción en la bitácora
    await this.actionlog.logAction(
      'POWER_OFF_DEVICE',
      userId,
      'El dispositivo con ID ${deviceId} ha sido apagado.',
    );
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al intentar obtener los usuarios',
      );
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const prevData = { ...user }; // Copiar datos previos para comparar
    this.userRepository.merge(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    await this.actionlog.logAction(
      'UPDATE_USER',
      id,
      `Usuario actualizado: ${updateUserDto.email}`,
    );
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      await this.actionlog.logAction(
        'DELETE_USER',
        id,
        `Usuario eliminado: ${id}`,
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        console.error('Error during user deletion:', error);
        if (
          error.message.includes(
            "Field 'description' doesn't have a default value",
          )
        ) {
          throw new BadRequestException(
            "Field 'description' doesn't have a default value",
          );
        } else {
          throw new InternalServerErrorException(
            'An error occurred while trying to delete the user.',
          );
        }
      } else {
        console.error('Unexpected error during user deletion:', error);
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  // async remove(id: number): Promise<void> {
  //   const result = await this.userRepository.delete(id);
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`User with ID "${id}" not found`);
  //   }
  //   await this.bitacoraService.logDeleteUser(id);
  // }

  async findByEmailHash(email: string): Promise<User | undefined> {
    try {
      //  console.log('Email recibido:', email);
      const tempUser = new User();
      const emailHash = tempUser.hashField(email);

      //  console.log('Buscando por email_hash:', emailHash);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email_hash = :hash', { hash: emailHash })
        .getOne();

      if (!user) {
        throw new NotFoundException(
          `No se encontró un usuario con el email ${email}`,
        );
      }

      // Convertir a instancia de User
      const userInstance = Object.assign(new User(), user);
      //  console.log('Usuario encontrado:', userInstance);

      // Desencriptar los campos necesarios
      const decryptedUser = userInstance.toJSON();
      //  console.log('Usuario desencriptado:', decryptedUser);

      return decryptedUser;
    } catch (error) {
      console.error('Error en findByEmailHash:', error);
      throw error;
    }
  }
}
