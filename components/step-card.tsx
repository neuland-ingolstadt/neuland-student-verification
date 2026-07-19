import type React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface StepCardProps {
  progress: number
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  progressClassName?: string
}

export function StepCard({
  progress,
  title,
  children,
  footer,
  progressClassName,
}: StepCardProps) {
  return (
    <div>
      <Card className="p-3 gap-3 min-h-128">
        <CardHeader className="flex flex-col items-start gap-6">
          <Progress
            aria-label="Verification..."
            value={progress}
            className={cn(progressClassName, 'mt-4')}
          />
          <h1>{title}</h1>
        </CardHeader>

        <Separator />

        <CardContent className="flex grow flex-col gap-2">
          {children}
        </CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  )
}
