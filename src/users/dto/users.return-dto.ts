import { Role } from "@prisma/client";

export class GetProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  roles: Role[];
  description: string;
}
