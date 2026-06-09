import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

const logoUrl = new URL(
  'favicon.svg',
  process.env.BASE_URL || 'http://localhost:3000'
).href

interface Step0VerificationEmailProps {
  name: string
}

const Step0VerificationEmail = ({
  name = '%NAME%',
}: Step0VerificationEmailProps) => {
  return (
    <Html lang="de">
      <Tailwind>
        <Head>
          <title>Studierendenstatus verifizieren</title>
        </Head>
        <Preview>
          Bitte verifiziere deinen Studierendenstatus innerhalb der nächsten 14
          Tage
        </Preview>
        <Body className="bg-gray-50 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] mx-auto my-0 max-w-[600px]">
            {/* Logo Header */}
            <Section className="mb-[24px]">
              <Img
                src={logoUrl}
                alt="Neuland Logo"
                width="100"
                height="auto"
                className="w-[100px] h-auto mx-auto"
              />
            </Section>

            <Heading className="text-[24px] font-medium text-gray-900 m-0 mb-[24px] text-center">
              Studierendenstatus verifizieren
            </Heading>

            <Hr className="border-t border-gray-200" />

            <Section className="mt-[24px] bg-blue-50 border border-green-200 rounded-[8px] p-[16px]">
              <Text className="text-[14px] leading-[20px] text-blue-800 m-0">
                <strong>Hinweis:</strong> Aufgrund eines technischen Problems
                könnte es sein, dass du diese E-Mail bereits erhalten hast. Wir
                bitten um Entschuldigung für eventuelle Unannehmlichkeiten.
              </Text>
            </Section>

            <Section>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[16px]">
                Hallo {name},
              </Text>

              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[16px]">
                gemäß unserer Satzung sind Studierende vom Mitgliedsbeitrag
                befreit, alle anderen zahlen einen Mitgliedsbeitrag in Höhe von
                20 € pro Jahr.
              </Text>

              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                Damit du weiterhin keinen Beitrag zahlen musst bitten wir dich,
                deinen Studierendenstatus innerhalb der nächsten 14 Tage über
                unser Tool zu verifizieren:
              </Text>

              <Button
                href="https://verification.neuland-ingolstadt.de/step1"
                className="bg-blue-500 rounded-[4px] text-white font-medium py-[10px] px-[18px] text-[16px] no-underline text-center inline-block box-border"
              >
                Status verifizieren
              </Button>

              <Text className="text-[16px] leading-[24px] text-gray-700 mt-[24px] mb-[16px]">
                Solltest du nicht länger Mitglied sein wollen, kannst du
                mithilfe einer formlosen E-Mail an{' '}
                <a
                  href="mailto:info@neuland-ingolstadt.de"
                  className="text-blue-500"
                >
                  info@neuland-ingolstadt.de
                </a>{' '}
                austreten. Bitte achte darauf, dass du die E-Mail von derselben
                Adresse verschickst, mit der du dich bei Neuland Ingolstadt
                angemeldet hast.
              </Text>

              <Text className="text-[16px] leading-[24px] text-gray-700 mt-[32px] mb-[8px]">
                Liebe Grüße
              </Text>

              <Text className="text-[16px] leading-[24px] text-gray-700 font-medium m-0">
                die Neuland-Orga
              </Text>
            </Section>

            {/* Signature */}
            <Section className="mt-[40px]">
              <Hr className="border-t border-gray-200 mb-[32px]" />

              <Section className="bg-gray-50 p-[24px] rounded-[8px] border border-gray-100">
                <Text className="text-[16px] leading-[24px] text-gray-700 font-medium m-0 mb-[16px]">
                  Neuland Ingolstadt e.V.
                </Text>

                <Row>
                  <Column>
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                      Esplanade 10
                    </Text>
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0 mb-[16px]">
                      85049 Ingolstadt
                    </Text>

                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                      <span className="text-gray-500">E-Mail:</span>{' '}
                      <a
                        href="mailto:info@neuland-ingolstadt.de"
                        className="text-blue-500 no-underline hover:underline"
                      >
                        info@neuland-ingolstadt.de
                      </a>
                    </Text>
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0 mb-[16px]">
                      <span className="text-gray-500">Telefon:</span> 015678
                      384646
                    </Text>
                  </Column>
                </Row>

                <Hr className="border-t border-gray-200 my-[16px]" />

                <Row>
                  <Column className="pr-[12px]">
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                      <span className="text-gray-500">Erster Vorstand:</span>{' '}
                      Felix Weber
                    </Text>
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                      <span className="text-gray-500">Zweiter Vorstand:</span>{' '}
                      Nico Märtin
                    </Text>
                    <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                      <span className="text-gray-500">Dritter Vorstand:</span>{' '}
                      Ronja Meitz
                    </Text>
                  </Column>
                </Row>

                <Hr className="border-t border-gray-200 my-[16px]" />

                <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                  <span className="text-gray-500">Registergericht:</span>{' '}
                  Amtsgericht Ingolstadt
                </Text>
                <Text className="text-[14px] leading-[22px] text-gray-600 m-0">
                  <span className="text-gray-500">Registernummer:</span> VR
                  201088
                </Text>
              </Section>
            </Section>
          </Container>

          <Container className="max-w-[600px] mx-auto mt-[32px] text-center">
            <Text className="text-[14px] text-gray-500 m-0">
              © {new Date().getFullYear()} Neuland Ingolstadt e.V. - Alle Rechte
              vorbehalten.
            </Text>
            <Text className="text-[14px] text-gray-500 m-0">
              <a
                href={process.env.IMPRINT_URL}
                className="text-blue-500 underline"
              >
                Impressum
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

Step0VerificationEmail.PreviewProps = {
  name: 'Max Mustermann',
}

export default Step0VerificationEmail
