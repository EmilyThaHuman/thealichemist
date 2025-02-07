import { cn } from "@/lib/utils";
import ReactTextareaAutosize from "react-textarea-autosize";

export const TextareaAutosize = ({
  value,
  onValueChange,
  textareaRef,
  className,
  placeholder = "",
  minRows = 1,
  maxRows = 6,
  maxLength,
  onKeyDown = () => {},
  onPaste = () => {},
  onCompositionStart = () => {},
  onCompositionEnd = () => {},
}) => {
  return (
    <ReactTextareaAutosize
      ref={textareaRef}
      className={cn(
        "bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border-2 px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      minRows={minRows}
      maxRows={minRows > maxRows ? minRows : maxRows}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      onChange={(event) => onValueChange(event.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
    />
  );
};

export default TextareaAutosize;
