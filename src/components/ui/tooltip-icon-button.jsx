"use client";

import { forwardRef } from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TooltipIconButton = forwardRef(function TooltipIconButton(props, ref) {
  const {
    children,
    tooltip,
    side = "bottom",
    className,
    delayDuration = 700,
    ...rest
  } = props;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            {...rest}
            className={cn("size-6 p-1", className)}
            ref={ref}
          >
            {children}
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

TooltipIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  side: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  className: PropTypes.string,
  delayDuration: PropTypes.number,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

TooltipIconButton.defaultProps = {
  side: "bottom",
  delayDuration: 700,
  variant: "ghost",
  size: "icon",
};

TooltipIconButton.displayName = "TooltipIconButton";

export { TooltipIconButton };
export default TooltipIconButton;
