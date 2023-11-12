export interface User {
  name: string
  email: string
}

export interface UserManagement {
  getUser(email: string): Promise<User | null>
  updateUser(privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void>
}
