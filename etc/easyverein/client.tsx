type EasyVereinUserId = number
type EasyVereinContactDetailsLink = string
type EasyVereinCustomFieldSchemaId = number
type EasyVereinCustomFieldInstanceId = number

export interface EasyVereinMember {
  id: EasyVereinUserId
  emailOrUserName: string
  contactDetails: EasyVereinContactDetailsLink
}

export interface EasyVereinContactDetails {
  firstName: string
  familyName: string
}

export interface EasyVereinCustomField {
  id: EasyVereinCustomFieldInstanceId
  customField: string
}

export class EasyVereinClient {
  private apiKey: string
  private endpoint: string

  constructor (apiKey: string, apiVersion: string = 'v1.7') {
    this.apiKey = apiKey
    this.endpoint = `https://hexa.easyverein.com/api/${apiVersion}`
  }

  private async get (path: string, params: any = undefined): Promise<Response> {
    return fetch(
      params !== undefined ? path + '?' + new URLSearchParams(params) : path,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )
  }

  private async post (path: string, body: any): Promise<Response> {
    return fetch(
      path,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
  }

  private async patch (path: string, body: any): Promise<Response> {
    return fetch(
      path,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
  }

  private async getPagedResults (path: string, params: any = undefined): Promise<any[]> {
    const allResults: any[] = []

    do {
      const response = await this.get(path, params)

      if (response.status !== 200) {
        throw new Error(`Failed to get paged results: ${await response.text()}`)
      }

      const { results, next } = await response.json()

      allResults.push(...results)
      path = next
    } while (path != null)

    return allResults
  }

  public async getMembers (email: string | undefined = undefined, query: string = '{id,emailOrUserName,contactDetails}'): Promise<EasyVereinMember[]> {
    return await this.getPagedResults(this.endpoint + '/member', { email, query })
  }

  public async getContactDetails (contactDetails: EasyVereinContactDetailsLink, query: string = '{firstName,familyName}'): Promise<EasyVereinContactDetails> {
    const response = await this.get(contactDetails, { query })

    if (response.status === 200) {
      return await response.json()
    } else {
      throw new Error(`Failed to get contact details: ${await response.text()}`)
    }
  }

  public async getCustomFields (user: EasyVereinUserId): Promise<EasyVereinCustomField[]> {
    return await this.getPagedResults(`${this.endpoint}/member/${user}/custom-fields`)
  }

  public async createCustomField (user: EasyVereinUserId, customField: EasyVereinCustomFieldSchemaId, value: string): Promise<void> {
    const response = await this.post(`${this.endpoint}/member/${user}/custom-fields`, { customField, value })

    if (response.status !== 201) {
      throw new Error(`Failed to create custom field: ${await response.text()}`)
    }
  }

  public async updateCustomField (user: EasyVereinUserId, customField: EasyVereinCustomFieldInstanceId, value: string): Promise<void> {
    const response = await this.patch(`${this.endpoint}/member/${user}/custom-fields/${customField}`, { value })

    if (response.status !== 200) {
      throw new Error(`Failed to update custom field: ${await response.text()}`)
    }
  }
}
