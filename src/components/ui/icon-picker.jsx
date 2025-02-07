import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconPdf } from "@tabler/icons-react";
import {
  Activity,
  AirVent,
  Airplay,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Anchor,
  Aperture,
  Archive,
  ArchiveX,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AtSign,
  Award,
  Axe,
  Banana,
  BarChart,
  Battery,
  Beaker,
  Bell,
  BellDot,
  BellMinus,
  BellOff,
  BellPlus,
  BellRing,
  Bike,
  Binary,
  Bird,
  Bitcoin,
  Bluetooth,
  Book,
  Bookmark,
  Box,
  Brain,
  Briefcase,
  Bug,
  Building,
  Bus,
  Cake,
  Calculator,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Cloud,
  Code,
  Coffee,
  Command,
  Compass,
  Copy,
  Copyright,
  CreditCard,
  Crop,
  Cross,
  Database,
  Delete,
  Divide,
  DollarSign,
  Download,
  Droplet,
  Edit,
  ExternalLink,
  Eye,
  File,
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
  Film,
  Filter,
  Flag,
  Folder,
  FolderOpen,
  Frown,
  Gift,
  Globe,
  Grape,
  Grid,
  Hash,
  Headphones,
  Heart,
  Hexagon,
  Home,
  Image,
  Inbox,
  Info,
  Italic,
  Key,
  Layers,
  Layout,
  LifeBuoy,
  Link,
  List,
  Loader,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  Maximize,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minimize,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Mouse,
  Music,
  Navigation,
  Network,
  Newspaper,
  Octagon,
  Package,
  Palette,
  Paperclip,
  Pause,
  Pen,
  Pencil,
  Phone,
  PieChart,
  Play,
  Plus,
  PlusCircle,
  Power,
  Printer,
  Radio,
  RefreshCw,
  Repeat,
  Reply,
  Rewind,
  Save,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  ShieldOff,
  Shuffle,
  Slash,
  Sliders,
  Smartphone,
  Smile,
  Speaker,
  Square,
  Star,
  StopCircle,
  Sun,
  Sunrise,
  Sunset,
  Tablet,
  Tag,
  Target,
  Terminal,
  Thermometer,
  ThumbsDown,
  ThumbsUp,
  Trash,
  Trash2,
  Triangle,
  Truck,
  Tv,
  Type,
  Umbrella,
  Underline,
  Unlock,
  Upload,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Video,
  VideoOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Watch,
  Wifi,
  WifiOff,
  Wind,
  Wrench,
  X,
  XCircle,
  XSquare,
  Zap,
  ZapOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
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
// const MIME_TYPE_MAP = {
//   "application/pdf": { icon: IconPdf, color: "text-red-600" },
//   "application/json": { icon: FileJson, color: "text-emerald-500" },
//   "text/plain": { icon: FileText, color: "text-blue-500" },
//   "text/markdown": { icon: FileText, color: "text-blue-500" },
//   "text/csv": { icon: FileSpreadsheet, color: "text-emerald-500" },
//   "application/x-httpd-php": { icon: FileCode, color: "text-yellow-500" },
//   "application/xml": { icon: FileJson, color: "text-emerald-500" },
//   "application/x-sh": { icon: FileTerminal, color: "text-purple-400" },
// };
const MIME_TYPE_MAP = {
  "application/pdf": {
    icon: IconPdf,
    color: "red",
    textColor: "text-red-600",
    bgColor: "bg-red-600/5",
    borderColor: "border-y-red-600 border-x-red-600",
  },
  "application/json": {
    icon: FileJson,
    color: "yellow",
    textColor: "text-yellow-500",
    bgColor: "bg-yellow-500/5",
    borderColor: "border-y-yellow-500 border-x-yellow-500",
  },
  "text/plain": {
    icon: FileText,
    color: "blue",
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-y-blue-500 border-x-blue-500",
  },
  "text/markdown": {
    icon: FileText,
    color: "blue",
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-y-blue-500 border-x-blue-500",
  },
  "text/javascript": {
    icon: FileCode,
    color: "purple",
    textColor: "text-purple-500",
    bgColor: "bg-purple-500/5",
    borderColor: "border-y-purple-500 border-x-purple-500",
  },
  "text/x-markdown": {
    icon: FileText,
    color: "blue",
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-y-blue-500 border-x-blue-500",
  },
  "text/csv": {
    icon: FileSpreadsheet,
    color: "emerald",
    textColor: "text-emerald-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-y-emerald-500 border-x-emerald-500",
  },
  "application/x-httpd-php": {
    icon: FileCode,
    color: "yellow",
    textColor: "text-yellow-500",
    bgColor: "bg-yellow-500/5",
    borderColor: "border-y-yellow-500 border-x-yellow-500",
  },
  "application/xml": {
    icon: FileJson,
    color: "emerald",
    textColor: "text-emerald-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-y-emerald-500 border-x-emerald-500",
  },
  "application/x-sh": {
    icon: FileTerminal,
    color: "purple",
    textColor: "text-purple-400",
    bgColor: "bg-purple-400/5",
    borderColor: "border-y-purple-400 border-x-purple-400",
  },
  "image/png": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
  "image/jpeg": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
  "image/jpg": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
  "image/gif": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
  "image/webp": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
  "image/svg": {
    icon: FileImage,
    color: "green",
    textColor: "text-green-500",
    bgColor: "bg-green-500/5",
    borderColor: "border-y-green-500 border-x-green-500",
  },
};
export const getFileColor = (mimeType) => {
  console.log(mimeType);
  return MIME_TYPE_MAP[mimeType]?.color || "gray";
};

export const getFileTextColor = (mimeType) => {
  console.log(mimeType);
  return MIME_TYPE_MAP[mimeType]?.textColor || "text-gray-400";
};

export const getFileBgColor = (mimeType) => {
  console.log(mimeType);
  return MIME_TYPE_MAP[mimeType]?.bgColor || "bg-gray-400/5";
};

export const getFileBorderColor = (mimeType) => {
  console.log(mimeType);
  return MIME_TYPE_MAP[mimeType]?.borderColor || "border-gray-400";
};

export const getFileIcon = (filename, mimeType) => {
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
};

// Define our icon mapping
const iconComponents = {
  Activity,
  AirVent,
  Airplay,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Anchor,
  Aperture,
  Archive,
  ArchiveX,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AtSign,
  Award,
  Axe,
  Banana,
  Battery,
  Beaker,
  Bell,
  BellDot,
  BellMinus,
  BellOff,
  BellPlus,
  BellRing,
  Bike,
  Binary,
  Bird,
  Bitcoin,
  Bluetooth,
  Book,
  Bookmark,
  Box,
  Briefcase,
  Bug,
  Building,
  Bus,
  Cake,
  Calculator,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Cloud,
  Code,
  Coffee,
  Command,
  Compass,
  Copy,
  Copyright,
  CreditCard,
  Crop,
  Cross,
  Database,
  Delete,
  Divide,
  DollarSign,
  Download,
  Droplet,
  Edit,
  Eye,
  File,
  FileText,
  Film,
  Filter,
  Flag,
  Folder,
  FolderOpen,
  Frown,
  Gift,
  Globe,
  Grape,
  Grid,
  Hash,
  Headphones,
  Heart,
  Hexagon,
  Home,
  Image,
  Inbox,
  Info,
  Italic,
  Key,
  Layers,
  Layout,
  LifeBuoy,
  Link,
  List,
  Loader,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  Maximize,
  Menu,
  MessageCircle,
  Mic,
  Minimize,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Mouse,
  Music,
  Navigation,
  Network,
  Newspaper,
  Octagon,
  Package,
  Paperclip,
  Pause,
  Pen,
  Pencil,
  Phone,
  PieChart,
  Play,
  Plus,
  PlusCircle,
  Power,
  Printer,
  Radio,
  RefreshCw,
  Repeat,
  Reply,
  Rewind,
  Save,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  ShieldOff,
  Shuffle,
  Slash,
  Sliders,
  Smartphone,
  Smile,
  Speaker,
  Square,
  Star,
  StopCircle,
  Sun,
  Sunrise,
  Sunset,
  Tablet,
  Tag,
  Target,
  Terminal,
  Thermometer,
  ThumbsDown,
  ThumbsUp,
  Trash,
  Trash2,
  Triangle,
  Truck,
  Tv,
  Type,
  Umbrella,
  Underline,
  Unlock,
  Upload,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Video,
  VideoOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Watch,
  Wifi,
  WifiOff,
  Wind,
  X,
  XCircle,
  XSquare,
  Zap,
  ZapOff,
  ZoomIn,
  ZoomOut,
  search: Search,
  code: Code,
  analytics: BarChart,
  palette: Palette,
  chat: MessageCircle,
  files: File,
  wrench: Wrench,
  map: Map,
  text: FileText,
  camera: Camera,
  settings: Settings,
  knowledge: Book,
  brain: Brain,
  image: Image,
  audio: Music,
  video: Video,
  file: File,
  paperclip: Paperclip,
  "external-link": ExternalLink,
  download: Download,
  plus: Plus,
  close: X,
  "message-square": MessageSquare,
  "file-text": FileText,
  globe: Globe,
  pdf: IconPdf,
  "file-spreadsheet": FileSpreadsheet,
  "file-code": FileCode,
  "file-image": FileImage,
  "file-audio": FileAudio,
  "file-video": FileVideo,
  "file-pdf": IconPdf,
  "file-json": FileJson,
  "file-cog": FileCog,
  "file-terminal": FileTerminal,
  "file-search": FileSearch,
};

// Hook for icon picking functionality
export const useIconPicker = () => {
  const icons = useMemo(
    () =>
      Object.entries(iconComponents).map(([name, Component]) => ({
        name,
        friendly_name: name.match(/[A-Z][a-z]+/g)?.join(" ") ?? name,
        Component,
      })),
    [],
  );

  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      if (search === "") return true;
      return icon.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [icons, search]);

  return { search, setSearch, icons: filteredIcons };
};

// Icon renderer component
export function IconRenderer({ icon, variant = "default", ...props }) {
  if (variant === "file-icon") {
    const fileIcon = getFileIcon(icon, props.mimeType);
    const FileIconComponent = iconComponents[fileIcon.icon];
    return <FileIconComponent {...props} />;
  }
  const IconComponent = iconComponents[icon];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}

IconRenderer.displayName = "IconRenderer";

IconRenderer.propTypes = {
  icon: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "file-icon"]),
  mimeType: PropTypes.string,
};

// Preview component
export function IconPicker({ onSelect }) {
  const { search, setSearch, icons } = useIconPicker();

  return (
    <Card className="w-full max-w-2xl p-4">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        <ScrollArea className="h-96">
          <div className="grid grid-cols-4 gap-4 p-2 md:grid-cols-6 lg:grid-cols-8">
            {icons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => onSelect?.(icon.name)}
                className="flex flex-col items-center justify-center rounded-lg p-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <icon.Component className="h-6 w-6" />
                <span className="mt-1 text-xs">{icon.friendly_name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

IconPicker.displayName = "IconPicker";

export default IconPicker;
