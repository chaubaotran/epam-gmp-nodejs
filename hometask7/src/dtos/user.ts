export interface CreateUserRequestDto {
  login: string;
  password: string;
  age: number;
}

export interface UpdateUserRequestDto extends CreateUserRequestDto {}
