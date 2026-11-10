export interface UserDetails {
  phoneNumber: string | null;
  address: string | null;
  dob: string | null;
  pictureUrl: string | null;
}

export interface User {
  id: number;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
  details: UserDetails | null;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  pictureUrl: string;
  dateOfBirth: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
