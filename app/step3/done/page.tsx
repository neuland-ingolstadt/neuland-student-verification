'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider, Progress } from '@heroui/react'

export default function Page() {
  return (
    <>
      <div>
        <Card className="p-3 gap-3">
          <CardHeader className="flex flex-col items-start gap-6">
            <Progress
              aria-label="Verification..."
              size="md"
              value={100}
              color="success"
              showValueLabel={false}
            />
            <h1>Schritt 3: Verifikation abschließen</h1>
          </CardHeader>

          <Divider />

          <CardBody>
            <p className="font-bold">
              Danke, dein Studierendenstatus wurde verifiziert!
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
