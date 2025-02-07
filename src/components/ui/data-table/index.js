import { cn } from '@/lib/utils'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function DataTable({
  columns,
  data,
  onRowClick,
  onRowAction,
  isLoading,
  className
}) {
  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                  'first:pl-6 last:pr-6',
                  column.className
                )}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
              </th>
            ))}
            <th className="w-[50px]" /> {/* Actions column */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border/50 transition-colors',
                'hover:bg-muted/50 cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-sm',
                    'first:pl-6 last:pr-6',
                    column.className
                  )}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              <td className="w-[50px] pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onRowAction?.map(({ label, action }) => (
                      <DropdownMenuItem
                        key={label}
                        onClick={(e) => {
                          e.stopPropagation()
                          action(row)
                        }}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 