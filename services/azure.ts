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
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
