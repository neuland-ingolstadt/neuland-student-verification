import { EasyVereinClient } from '.'

const EASYVEREIN_EMAIL_CF = Number(process.env.EASYVEREIN_EMAIL_CF)
const EASYVEREIN_DATE_CF = Number(process.env.EASYVEREIN_DATE_CF)

export interface User {
  name: string
  email: string
}

const client = new EasyVereinClient(process.env.EASYVEREIN_API_KEY as string)

async function updateCustomField(
  userId: number,
  customFieldId: number,
  value: string
): Promise<void> {
  const customFields = await client.getCustomFields(userId)
  const customField = customFields.find((customField) =>
    customField.customField.endsWith(`/${customFieldId}`)
  )
  if (customField) {
    await client.updateCustomField(userId, customField.id, value)
  } else {
    await client.createCustomField(userId, customFieldId, value)
  }
}

export async function getUser(email: string): Promise<User | null> {
  const members = await client.getMembers(email)
  if (members.length > 0) {
    const contactDetails = await client.getContactDetails(
      members[0].contactDetails
    )
    return {
      name: `${contactDetails?.firstName} ${contactDetails?.familyName}`,
      email: members[0].emailOrUserName,
    }
  }
  return null
}

export async function updateUser(
  privateEmail: string,
  studentEmail: string,
  verifiedAt: Date
): Promise<void> {
  const members = await client.getMembers(privateEmail)
  if (members.length > 0) {
    await updateCustomField(members[0].id, EASYVEREIN_EMAIL_CF, studentEmail)
    await updateCustomField(
      members[0].id,
      EASYVEREIN_DATE_CF,
      verifiedAt.toISOString().substring(0, 10)
    )
  } else {
    throw new Error('Member not found')
  }
}
