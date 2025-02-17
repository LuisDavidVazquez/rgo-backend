export const USER_LEVELS = {
  ADMIN: '1', // Nivel administrativo
  DISTRIBUTOR: '2', // Distribuidores
  END_USER: '3', // Usuarios finales
} as const;

// Type para usar en TypeScript
export type UserLevel = (typeof USER_LEVELS)[keyof typeof USER_LEVELS];

// Helper function para validar niveles
export function isValidUserLevel(level: string): level is UserLevel {
  return Object.values(USER_LEVELS).includes(level as UserLevel);
}

// Helper function para obtener descripción del nivel
export function getUserLevelDescription(level: UserLevel): string {
  switch (level) {
    case USER_LEVELS.ADMIN:
      return 'Administrador';
    case USER_LEVELS.DISTRIBUTOR:
      return 'Distribuidor';
    case USER_LEVELS.END_USER:
      return 'Usuario Final';
    default:
      return 'Desconocido';
  }
}
