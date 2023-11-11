interface User {
  name: string
  email: string
}

interface UserManagement {
  getUser(email: string): Promise<User | null>
  updateUser(privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void>
}

class EasyVereinManagement implements UserManagement {
  async getUser (email: string): Promise<User | null> {
    // todo actually query easyverein
    if (email === 'tester@example.com') {
      return { name: 'Tester McTestgesicht', email }
    } else {
      return null
    }
  }

  async updateUser (privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void> {
    // todo actually update easyverein
  }
}

export function getUserManagement () {
  return new EasyVereinManagement()
}
