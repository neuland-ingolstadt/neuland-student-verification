export interface User {
  name: string
  email: string
}

export interface UserManagement {
  /**
   * Retrieve a member.
   * @param email The email address of the member.
   * @returns The member or null if not found.
   */
  getUser(email: string): Promise<User | null>

  /**
   * Update a member.
   * @param privateEmail The private email address of the member.
   * @param studentEmail The student email address of the member.
   * @param verifiedAt The date when the student email address was verified.
   * @throws Error if the member was not found.
   */
  updateUser(privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void>
}
