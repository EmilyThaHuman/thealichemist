import { IconPdf } from "@tabler/icons-react";
import {
  Archive,
  Binary,
  FileAudio,
  FileCode,
  FileCog,
  FileImage,
  FileJson,
  FileSearch,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  FileVideo,
} from "lucide-react";
import PropTypes from "prop-types";
import { useCallback } from "react";

const FILE_CATEGORIES = {
  document: {
    extensions: [
      "txt",
      "md",
      "doc",
      "docx",
      "rtf",
      "odt",
      "pages",
      "tex",
      "pdf",
      "epub",
      "djvu",
    ],
    icon: FileText,
    color: "text-blue-500",
  },
  spreadsheet: {
    extensions: ["xls", "xlsx", "numbers", "ods", "csv", "tsv"],
    icon: FileSpreadsheet,
    color: "text-emerald-500",
  },
  image: {
    extensions: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
      "ico",
      "tiff",
      "psd",
      "ai",
    ],
    icon: FileImage,
    color: "text-green-500",
    mimePrefix: "image/",
  },
  video: {
    extensions: [
      "mp4",
      "webm",
      "mov",
      "avi",
      "mkv",
      "flv",
      "wmv",
      "m4v",
      "3gp",
    ],
    icon: FileVideo,
    color: "text-red-500",
    mimePrefix: "video/",
  },
  audio: {
    extensions: [
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "flac",
      "aac",
      "wma",
      "aiff",
      "opus",
    ],
    icon: FileAudio,
    color: "text-purple-500",
    mimePrefix: "audio/",
  },
  code: {
    extensions: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "scss",
      "less",
      "php",
      "py",
      "java",
      "cpp",
      "h",
      "rb",
      "go",
      "rs",
      "swift",
    ],
    icon: FileCode,
    color: "text-yellow-500",
  },
  data: {
    extensions: ["json", "xml", "yaml", "yml", "toml", "sql", "graphql"],
    icon: FileJson,
    color: "text-emerald-500",
  },
  archive: {
    extensions: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "iso"],
    icon: Archive,
    color: "text-amber-500",
  },
  binary: {
    extensions: ["exe", "dll", "so", "dylib", "bin", "dat"],
    icon: Binary,
    color: "text-gray-500",
  },
  system: {
    extensions: ["sys", "inf", "config", "conf", "log", "cache"],
    icon: FileCog,
    color: "text-gray-400",
  },
  script: {
    extensions: ["sh", "bash", "bat", "ps1", "cmd"],
    icon: FileTerminal,
    color: "text-purple-400",
  },
};

// Create a mapping of extensions to categories for O(1) lookup
const EXTENSION_MAP = Object.entries(FILE_CATEGORIES).reduce(
  (acc, [category, data]) => {
    data.extensions.forEach((ext) => {
      acc[ext] = {
        icon: data.icon,
        color: data.color,
        category,
      };
    });
    return acc;
  },
  {},
);

// Create a mapping of mime prefixes to categories for O(1) lookup
const MIME_PREFIX_MAP = Object.entries(FILE_CATEGORIES).reduce(
  (acc, [category, data]) => {
    if (data.mimePrefix) {
      acc[data.mimePrefix] = {
        icon: data.icon,
        color: data.color,
        category,
      };
    }
    return acc;
  },
  {},
);

// Common MIME types that might differ from extension mapping
const MIME_TYPE_MAP = {
  "application/pdf": { icon: IconPdf, color: "text-red-600" },
  "application/json": { icon: FileJson, color: "text-emerald-500" },
  "text/plain": { icon: FileText, color: "text-blue-500" },
  "text/markdown": { icon: FileText, color: "text-blue-500" },
  "text/csv": { icon: FileSpreadsheet, color: "text-emerald-500" },
  "application/x-httpd-php": { icon: FileCode, color: "text-yellow-500" },
  "application/xml": { icon: FileJson, color: "text-emerald-500" },
  "application/x-sh": { icon: FileTerminal, color: "text-purple-400" },
};
// Util to get the color value of the file type
export const getFileColor = (mimeType) => {
  return MIME_TYPE_MAP[mimeType]?.color || "text-gray-400";
};

export function FileIcon({
  filename = "",
  mimeType = "",
  className = "",
  size = 16,
  ...props
}) {
  // Memoize the icon resolution to prevent unnecessary recalculations
  const getFileIcon = useCallback(() => {
    // First, try to match by exact MIME type
    if (mimeType && MIME_TYPE_MAP[mimeType]) {
      return MIME_TYPE_MAP[mimeType];
    }

    // Then, try to match by MIME type prefix
    if (mimeType) {
      const prefix = mimeType.split("/")[0] + "/";
      if (MIME_PREFIX_MAP[prefix]) {
        return MIME_PREFIX_MAP[prefix];
      }
    }

    // Finally, try to match by file extension
    const extension = filename.split(".").pop()?.toLowerCase();
    if (extension && EXTENSION_MAP[extension]) {
      return EXTENSION_MAP[extension];
    }

    // Default fallback
    return {
      icon: FileSearch,
      color: "text-gray-400",
      category: "unknown",
    };
  }, [filename, mimeType]);

  const { icon: Icon, color } = getFileIcon();

  return <Icon className={`${color} ${className}`} size={size} {...props} />;
}

FileIcon.propTypes = {
  filename: PropTypes.string,
  mimeType: PropTypes.string,
  className: PropTypes.string,
};

export default FileIcon;
