import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PropTypes from "prop-types";
import { useCallback } from "react";
import FileIcon, { getFileColor } from "./FileIcon";

const getButtonVariantFromType = (mimeType) => {
  // Extract the main type (e.g., "image" from "image/png")
  const mainType = mimeType?.split("/")?.[0] || "";

  switch (mainType) {
    case "image":
      return "outline";
    case "video":
      return "destructive";
    case "audio":
      return "secondary";
    case "application":
      return "default";
    default:
      return "ghost";
  }
};

export const FileIconButton = ({
  filename,
  mimeType,
  onClick,
  tooltipText,
  disabled = false,
  loading = false,
  size = "default",
  className = "",
  variant: customVariant,
  ...props
}) => {
  const getButtonStyle = useCallback(() => {
    const color = getFileColor(mimeType);
    const baseStyle = "transition-all duration-200 hover:scale-105";
    const sizeStyles = {
      small: "p-1",
      default: "p-2",
      large: "p-3",
    };
    const iconSizes = {
      small: 16,
      default: 20,
      large: 24,
    };

    return {
      buttonClass: `${baseStyle} ${sizeStyles[size]} ${className}`,
      iconSize: iconSizes[size],
    };
  }, [size, className, mimeType]);

  const { buttonClass, iconSize } = getButtonStyle();
  const variant = customVariant || getButtonVariantFromType(mimeType);

  const button = (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      {...props}
    >
      <FileIcon
        filename={filename}
        mimeType={mimeType}
        size={iconSize}
        className={loading ? "animate-pulse" : ""}
      />
    </Button>
  );

  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

FileIconButton.propTypes = {
  filename: PropTypes.string,
  mimeType: PropTypes.string,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  className: PropTypes.string,
  variant: PropTypes.string,
};

FileIconButton.displayName = "FileIconButton";

export default FileIconButton;
