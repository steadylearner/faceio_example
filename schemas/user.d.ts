interface UserBase {
  facialId: string;
}

interface UserCreate extends UserBase {
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
  UserCreate,
  User,
}