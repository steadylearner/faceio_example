interface UserBase {
  facialId: string;
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
  User,
}