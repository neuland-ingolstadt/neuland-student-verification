import { User, UserManagement } from './types'

export class WeblingUserManagement implements UserManagement {
  async getUser (email: string): Promise<User | null> {
    // todo: do something
    return null
  }

  async updateUser (privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void> {
    // todo: do something
  }
}
