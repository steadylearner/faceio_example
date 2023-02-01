interface UserBase {
  facialId: string;
}

interface CreateUserRequest extends UserBase {
  name: string;
  email: string;
}

interface UpdateUserRequest extends UserBase {
  id: string,
  name: string;
  email: string;
}

interface User extends UserBase {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export {
  UserBase,
  CreateUserRequest,
  UpdateUserRequest,
  User,
}