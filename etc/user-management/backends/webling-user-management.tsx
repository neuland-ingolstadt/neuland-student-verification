import { User, UserManagement } from '../types'

const WEBLING_API_KEY = process.env.WEBLING_API_KEY as string
const WEBLING_PATH = process.env.WEBLING_PATH as string

export class WeblingUserManagement implements UserManagement {
  async getUser (email: string): Promise<User | null> {
    try {
      const response: any = await fetch(
        `${WEBLING_PATH}/member?filter=\`E-Mail\`="${email}"`,
        {
          method: 'GET',
          headers: {
            apikey: WEBLING_API_KEY
          }
        }
      )

      const responseJSON = await response.json()
      const memberUid = responseJSON.objects

      const detailedResponse: any = await fetch(
        `${WEBLING_PATH}/member/${memberUid}`,
        {
          method: 'GET',
          headers: {
            apikey: WEBLING_API_KEY
          }
        }
      )

      const detailedResponseJSON = await detailedResponse.json()
      const { Vorname, Name, EMail } = detailedResponseJSON.properties

      return { name: `${Vorname} ${Name}`, email: EMail }
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async updateUser (privateEmail: string, studentEmail: string, verifiedAt: Date): Promise<void> {
    try {
      // Get the member UID by private email
      const response: any = await fetch(
        `${WEBLING_PATH}/member?filter=\`E-Mail\`="${encodeURIComponent(privateEmail)}"`,
        {
          method: 'GET',
          headers: {
            apikey: WEBLING_API_KEY
          }
        }
      )

      if (response.status !== 200) {
        throw new Error(`Failed to get updateUser results: ${await response.text()}`)
      }

      const responseJSON = await response.json()
      const memberUid = responseJSON.objects

      // Prepare the data to be updated
      const updateData = {
        properties: {
          'Studierenden-Mail': studentEmail,
          'Verifiziert am': verifiedAt.toISOString() // Convert Date to UTC string
        }
      }

      // Make the PUT request to update the user data
      await fetch(
        `${WEBLING_PATH}/member/${memberUid}`,
        {
          method: 'PUT',
          headers: {
            apikey: WEBLING_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      )
    } catch (error) {
      // Handle any errors that might occur during the API call
      console.error('Error updating user:', error)
      throw error // You might want to handle this error in a more specific way based on your application's needs
    }
  }
}
