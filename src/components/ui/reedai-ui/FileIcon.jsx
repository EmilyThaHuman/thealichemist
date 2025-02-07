import DOMPurify from "dompurify";
import { themeIcons } from "seti-file-icons";
import PropTypes from "prop-types";
import { File } from "lucide-react";
import { cn } from "@/lib/utils";

const iconTheme = {
  blue: "#268bd2",
  grey: "#657b83",
  "grey-light": "#839496",
  green: "#859900",
  orange: "#cb4b16",
  pink: "#d33682",
  purple: "#6c71c4",
  red: "#dc322f",
  white: "#fdf6e3",
  yellow: "#b58900",
  ignore: "#586e75",
};

export const FileIcon = ({ filename, className, height = 16, width = 16 }) => {
  try {
    if (!filename) {
      return <File className={cn("h-4 w-4", className)} />;
    }

    const cleanFilename = filename.split(" (")[0];
    const getIcon = themeIcons(iconTheme);
    const { svg, color } = getIcon(cleanFilename);
    const sanitizedSVG = DOMPurify.sanitize(svg);

    return (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedSVG }}
        style={{
          width,
          height,
          fill: color,
          flexShrink: 0,
          display: "inline-flex",
        }}
        className={className}
      />
    );
  } catch (error) {
    console.error("Error in FileIcon:", error);
    // Fallback to default file icon if there's any error
    return <File className={cn("h-4 w-4", className)} />;
  }
};

FileIcon.propTypes = {
  filename: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FileIcon.defaultProps = {
  height: 16,
  width: 16,
  className: "",
};

export default FileIcon;
