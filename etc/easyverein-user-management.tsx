import { User, UserManagement } from './user-management'
import { EasyVereinClient } from './easyverein/client'

const EASYVEREIN_EMAIL_CF = Number(process.env.EASYVEREIN_EMAIL_CF)
const EASYVEREIN_DATE_CF = Number(process.env.EASYVEREIN_DATE_CF)

export class EasyVereinUserManagement implements UserManagement {
  private client = new EasyVereinClient(process.env.EASYVEREIN_API_KEY as string)

  private async updateCustomField (userId: number, customFieldId: number, value: string): Promise<void> {
    const customFields = await this.client.getCustomFields(userId)
    const customField = customFields.find(customField => customField.customField.endsWith(`/${customFieldId}`))
    if (customField) {
      await this.client.updateCustomField(userId, customField.id, value)
    } else {
      await this.client.createCustomField(userId, customFieldId, value)
    }
  }

  async getUser (email: string): Promise<User | null> {
    const members = await this.client.getMembers(email)
    if (members.length > 0) {
      const contactDetails = await this.client.getContactDetails(members[0].contactDetails)
      return {
        name: `${contactDetails?.firstName} ${contactDetails?.familyName}`,
        email: members[0].emailOrUserName
      }
    } else {
      return null
    }
  }

  async updateUser (privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void> {
    const members = await this.client.getMembers(privateEmail)
    if (members.length > 0) {
      await this.updateCustomField(members[0].id, EASYVEREIN_EMAIL_CF, studentEmail)
      await this.updateCustomField(members[0].id, EASYVEREIN_DATE_CF, verifiedAt.toISOString().substring(0, 10))
    } else {
      throw new Error('Member not found')
    }
  }
}
