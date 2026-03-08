/**
 * Domain Entity: User
 * Represents the core user data in the application.
 * This entity is framework-agnostic and contains pure business logic.
 */
export interface IUser {
  id: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
}