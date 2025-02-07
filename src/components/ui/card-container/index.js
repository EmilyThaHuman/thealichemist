import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export function ResponsiveCardContainer({ children, className }) {
  return (
    <Card
      className={cn(
        // Base styles
        'w-full overflow-hidden bg-background',
        // Responsive styles
        'min-h-[400px]', // Minimum height
        'sm:min-w-[600px]', // Minimum width on small screens
        'lg:min-w-[800px]', // Minimum width on large screens
        // Media queries for maintaining shape
        'sm:max-h-[600px] sm:overflow-auto',
        'md:max-h-[700px]',
        'lg:max-h-[800px]',
        className
      )}
    >
      {children}
    </Card>
  )
} 