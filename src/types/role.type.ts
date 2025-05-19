import { Role } from "@prisma/client";

export type TRoles = {
  id?: string;
  name: Role;
  permissions: string[];
};
