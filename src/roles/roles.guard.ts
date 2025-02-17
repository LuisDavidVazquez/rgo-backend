import { Injectable, CanActivate, ExecutionContext, Get, Post, Body } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service'; // Actualiza la ruta según sea necesario
import { Roles } from './decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RolesService, // Asume que tienes una función que puede verificar los roles de un usuario
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Supone que el usuario ya está definido (por ejemplo, por un guard previo de autenticación)

    if (!user) {
      return false; // Si no hay usuario, niega el acceso
    }

    // Comprueba si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some(async role => await this.roleService.userHasRole(user.id, role));
  }


  // @Roles('SuperAdministrador')
  // @Get()
  // async superadminRole() {
  //   // Tu lógica aquí
  // }
  // @Roles('Soporte')
  // @Get()
  // async soporteRole() {
  //   // Tu lógica aquí
  // }

  // @Roles('Ventas')
  // @Get()
  // async VentasRole() {
  //   // Tu lógica aquí
  // }

  // @Roles('administracion')
  // @Get()
  // async adminRole() {
  //   // Tu lógica aquí
  // }

  // // Puedes aplicar diferentes roles a diferentes rutas dentro del mismo controlador
  // @Roles('Distribuidor')
  // @Post()
  // async distRole(@Body() body: any) {
  //   // Tu lógica aquí tabla de roles 
  // }

  // @Roles('ClienteFinal')
  // @Post()
  // async clenteRole(@Body() body: any) {
  //   // Tu lógica aquí
  // }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

  //   if (!requiredRoles) {
  //     return true; // Si no hay roles requeridos, permitir
  //   }

  //   const request = context.switchToHttp().getRequest();
  //   const user = request.user; // Asume que user ya está establecido (por ejemplo, por un guard de autenticación previo)

  //   if (!user) {
  //     return false; // Si no hay usuario, denegar acceso
  //   }

  //   // Verifica si el usuario tiene alguno de los roles requeridos
  //   for (const role of requiredRoles) {
  //     const hasRole = await this.roleService.userHasRole(user.id, role);
  //     if (hasRole) {
  //       return true; // Si el usuario tiene al menos uno de los roles requeridos, permitir acceso
  //     }
  //   }

  //   return false; // Denegar acceso si el usuario no tiene ninguno de los roles requeridos
}
