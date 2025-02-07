import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

/*

# Documentation

```md
I'll create comprehensive documentation for the Radix UI Tooltip component based on the image, formatted to match your technical preferences.

# Radix UI Tooltip Documentation

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Installation

```bash
npm install @radix-ui/react-tooltip
```

## Basic Usage

```javascript
import * as Tooltip from '@radix-ui/react-tooltip'

export function TooltipDemo() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button>Hover me</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-white p-2 rounded-md shadow-lg">
            <p>Tooltip content</p>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
```

## Anatomy

```javascript
import * as Tooltip from '@radix-ui/react-tooltip'

// Provider (wraps all tooltips)
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## API Reference

### Provider

Wraps all tooltip components.

| Prop | Type | Default |
|------|------|---------|
| delayDuration | number | 700 |
| skipDelayDuration | number | 300 |
| disableHoverableContent | boolean | false |

### Root

Controls the behavior of the tooltip.

| Prop | Type | Default |
|------|------|---------|
| defaultOpen | boolean | false |
| open | boolean | - |
| onOpenChange | function | - |
| delayDuration | number | - |

### Trigger

The element that triggers the tooltip.

| Prop | Type | Default |
|------|------|---------|
| asChild | boolean | false |

### Content

The component that contains the tooltip content.

| Prop | Type | Default |
|------|------|---------|
| side | 'top' \| 'right' \| 'bottom' \| 'left' | 'top' |
| sideOffset | number | 0 |
| align | 'start' \| 'center' \| 'end' | 'center' |
| alignOffset | number | 0 |
| avoidCollisions | boolean | true |
| collisionBoundary | Element \| null | [] |
| collisionPadding | number | 0 |
| arrowPadding | number | 0 |
| sticky | 'partial' \| 'always' | 'partial' |

## Styling Example with Tailwind

```javascript
import * as Tooltip from '@radix-ui/react-tooltip'

export function StyledTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="px-4 py-2 rounded-md bg-slate-800 text-white">
            Hover me
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className="
              bg-white 
              px-4 
              py-2 
              rounded-lg 
              shadow-lg 
              animate-in 
              data-[state=closed]:fade-out-0 
              data-[state=closed]:zoom-out-95 
              data-[state=open]:fade-in-0 
              data-[state=open]:zoom-in-95
            "
          >
            <p className="text-sm text-slate-800">Tooltip content</p>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
```

## Accessibility

- Follows WAI-ARIA tooltip pattern
- Supports keyboard focus management
- Manages ARIA attributes automatically
- Handles screen reader announcements

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Follows progressive enhancement patterns
- Falls back gracefully in unsupported browsers

Let me know if you need any clarification or have questions about specific implementation details!
```

*/
