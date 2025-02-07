import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const WithTooltip = ({
  display,
  trigger,
  delayDuration = 500,
  side = "right",
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>

        <TooltipContent side={side}>{display}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
WithTooltip.displayName = "WithTooltip";

export default WithTooltip;
