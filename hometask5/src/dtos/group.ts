import { Permissions } from "../shared/enum";

export interface CreateGroupRequestDto {
  name: string;
  permissions: Array<Permissions>;
}

export interface UpdateGroupRequestDto extends CreateGroupRequestDto {}
