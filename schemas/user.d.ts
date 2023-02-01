interface UserBase {
  name: string;
  email: string;
}

interface CreateUserRequest extends UserBase {
  facialId: string;
}

interface UpdateUserRequest extends UserBase {
  id: string,
}

interface User extends UserBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export {
  UserBase,
  CreateUserRequest,
  UpdateUserRequest,
  User,
}