import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      variant="default"
      type="submit"
      className="w-full"
      disabled={loading}
    >
      <span>{children}</span>
      {loading ? <Spinner /> : <ArrowRight size={16} />}
    </Button>
  )
}

export { SubmitButton }
