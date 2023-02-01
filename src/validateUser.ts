enum UserValidationResult {
  None,
  // InvalidUsername,
  InvalidEmail,
  InvalidName,
  // TakenUsername,
  TakenFacialId,
  TakenEmail,
}

export const validateEmail = (email?: string) =>
  email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateName = (name?: string) =>
  name && /^[a-zA-Z][a-zA-Z ]{1,32}$/.test(name);

const validateUser = (
  name?: string, 
  email?: string
) => {
  if (!validateName(name)) {
    return UserValidationResult.InvalidName;
  }
  if (!validateEmail(email)) {
    return UserValidationResult.InvalidEmail;
  }

  return UserValidationResult.None;
};

export { UserValidationResult };
export default validateUser;
