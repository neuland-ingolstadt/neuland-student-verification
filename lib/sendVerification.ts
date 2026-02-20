import fs, { writeFile } from 'node:fs'
import { confirm, intro, log, outro, spinner } from '@clack/prompts'

import csv from 'csv-parser'
import colors from 'picocolors'
import { sendHtmlMail } from '@/services/azure'

type CsvData = {
  Vorname: string
  Nachname: string
  'Primäre E-Mail': string
}

type Member = {
  firstName: string
  lastName: string
  email: string
}

const title = colors.inverse(
  colors.greenBright('Neuland Ingolstadt Verification Tool')
)

const templateFile = './dist/step0.html'
const template = fs.readFileSync(templateFile, 'utf-8')

async function sendMails(members: Member[]) {
  const successfulMails: Member[] = []
  const failedMails: Member[] = []

  await Promise.all(
    members.map(async (member) => {
      try {
        const result = await sendHtmlMail(
          member.email,
          'Verifiziere deinen Studentenstatus',
          template.replace('%NAME%', member.firstName)
        )

        if (!result) {
          failedMails.push(member)
          log.error(
            `Failed to send email to ${colors.red(
              `${member.firstName} ${member.lastName}`
            )} <${member.email}>`
          )
          return false
        }

        successfulMails.push(member)
        return true
      } catch (error) {
        failedMails.push(member)
        log.error(
          `Error sending email to ${colors.red(
            `${member.firstName} ${member.lastName}`
          )} <${member.email}>: ${error}`
        )
        return false
      }
    })
  )

  writeFile(
    './mail/data/successfulMails.json',
    JSON.stringify(successfulMails),
    (err) => {
      if (err) {
        log.error(`Error writing successfulMails.json: ${err}`)
      } else {
        log.success('Successfully wrote successfulMails.json')
      }
    }
  )

  writeFile(
    './mail/data/failedMails.json',
    JSON.stringify(failedMails),
    (err) => {
      if (err) {
        log.error(`Error writing failedMails.json: ${err}`)
      } else {
        log.success('Successfully wrote failedMails.json')
      }
    }
  )

  if (failedMails.length > 0) {
    log.error(
      `Failed to send emails to ${colors.red(
        failedMails.length.toString()
      )} members.`
    )
  }
}

async function readCsvFile(file: string): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    try {
      fs.accessSync(file, fs.constants.R_OK)
    } catch {
      log.error(
        `Error: ${colors.red('File not found or not readable')}. Please make sure the file exists and is readable.`
      )
      reject(new Error('File not found or not readable'))
    }

    const results: Member[] = []

    fs.createReadStream(file, {
      encoding: 'utf-8',
    })
      .pipe(
        csv({
          separator: ';',
        })
      )
      .on('data', (data: CsvData) =>
        results.push({
          firstName: data.Vorname,
          lastName: data.Nachname,
          email: data['Primäre E-Mail'],
        })
      )
      .on('error', (error) => {
        log.error(
          `Error reading CSV file: ${colors.red(
            error.message
          )} - Please make sure the file is in the correct format.`
        )
        reject(error)
      })
      .on('end', () => {
        resolve(results)
      })
  })
}

async function main() {
  intro(title)
  log.message(
    'This tool is used to send verification emails to members of Neuland Ingolstadt e.V.'
  )
  log.message(
    `Please make sure to place a valid CSV file in the root directory called ${colors.greenBright('Mitgliederliste.csv')} from easyVerein.`
  )

  const members = await readCsvFile('./Mitgliederliste.csv')

  log.success(
    `Successfully read ${colors.greenBright(
      members.length.toString()
    )} members from CSV file.`
  )

  if (members.length === 0) {
    log.error(
      'No members found in CSV file. Please make sure the file is in the correct format.'
    )
    return
  }

  const shouldContinue = await confirm({
    message: `Are you sure you want to send ${colors.greenBright(
      members.length.toString()
    )} emails?`,
    initialValue: false,
  })

  if (shouldContinue !== true) {
    log.error('Aborted. No emails were sent.')
    outro(title)
    return
  }

  const s = spinner()
  s.start('⚡ Sending emails...')
  await sendMails(members)
  s.stop('⚡ Emails sent!')
}

main()
