export const appRoles = ["administrativo", "profesor", "alumno"] as const;

export type AppRole = (typeof appRoles)[number];

export type UserProfile = {
  id: string;
  auth_user_id: string;
  rol: AppRole;
  nombres: string;
  apellidos: string;
  email: string;
  activo: boolean;
};

export function isAppRole(value: string | null | undefined): value is AppRole {
  return appRoles.includes(value as AppRole);
}

export function roleHomePath(role: AppRole) {
  const paths: Record<AppRole, string> = {
    administrativo: "/admin",
    profesor: "/profesor",
    alumno: "/alumno",
  };

  return paths[role];
}
