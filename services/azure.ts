import { EmailClient, type EmailMessage } from '@azure/communication-email'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

const connectionString = process.env
  .AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING as string

const senderAddress = process.env.FROM_EMAIL as string

export async function sendEmail(
  to: string,
  subject: string,
  body: ReactElement
) {
  if (!connectionString) {
    console.error('No connection string provided')
    return
  }

  const emailClient = new EmailClient(connectionString)

  const [html, plainText] = await Promise.all([
    render(body, {
      pretty: true,
    }),
    render(body, {
      plainText: true,
    }),
  ])

  const emailContent: EmailMessage = {
    senderAddress: senderAddress as string,
    content: {
      subject,
      html,
      plainText,
    },
    recipients: {
      to: [
        {
          address: to,
          displayName: to,
        },
      ],
    },
  }

  try {
    const poller = await emailClient.beginSend(emailContent)
    const result = await poller.pollUntilDone()

    console.log('Email sent:', result)

    if (result.status === 'succeeded') {
      console.log('Email sent successfully')
      return true
    }
    console.error('Error sending email:', result.error)
    return false
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendHtmlMail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!connectionString) {
    console.error('No connection string provided')
    return false
  }

  const emailClient = new EmailClient(connectionString)

  const emailContent: EmailMessage = {
    senderAddress: senderAddress as string,
    content: {
      subject,
      html,
    },
    recipients: {
      to: [
        {
          address: to,
          displayName: to,
        },
      ],
    },
  }

  try {
    const poller = await emailClient.beginSend(emailContent)
    const result = await poller.pollUntilDone()
    if (result.status === 'Succeeded') {
      return true
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
