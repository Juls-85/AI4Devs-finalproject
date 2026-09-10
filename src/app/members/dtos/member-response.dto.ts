export class MemberResponseDto {
  memberId!: string;
  roleId!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  dni?: string;
  birthDate?: Date;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  membershipNumber?: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
  lastLoginAt?: Date;
  profilePicture?: string;
  isAdmin!: boolean;
}
