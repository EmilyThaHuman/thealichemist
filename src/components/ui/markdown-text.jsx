"use client";

import { SyntaxHighlighter } from "@/components/ui/assistant-ui/syntax-highlighter";
import { TooltipIconButton } from "@/components/ui/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";
import {
  MarkdownTextPrimitive,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import "katex/dist/katex.min.css";
import { CheckIcon, CopyIcon } from "lucide-react";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Custom hook for clipboard functionality
const useCopyToClipboard = ({ copiedDuration = 3000 } = {}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

// Code Header Component
const CodeHeader = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied ? <CopyIcon /> : <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

CodeHeader.propTypes = {
  language: PropTypes.string,
  code: PropTypes.string,
};

CodeHeader.displayName = "CodeHeader";

// Main MarkdownText Component Implementation
const MarkdownTextImpl = () => {
  const isCodeBlock = useIsMarkdownCodeBlock();

  // Component mapping for markdown elements
  const components = {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }) => (
      <h5
        className={cn(
          "my-4 text-lg font-semibold first:mt-0 last:mb-0",
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }) => (
      <h6
        className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("mb-5 mt-5 leading-7 first:mt-0 last:mb-0", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-primary font-medium underline underline-offset-4",
          className,
        )}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn("border-l-2 pl-6 italic", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
        {...props}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr className={cn("my-5 border-b", className)} {...props} />
    ),
    table: ({ className, ...props }) => (
      <table
        className={cn(
          "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
          className,
        )}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    tr: ({ className, ...props }) => (
      <tr
        className={cn(
          "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
          className,
        )}
        {...props}
      />
    ),
    sup: ({ className, ...props }) => (
      <sup
        className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "overflow-x-auto rounded-b-lg bg-black p-4 text-white",
          className,
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => {
      return (
        <code
          className={cn(
            !isCodeBlock && "bg-aui-muted rounded border font-semibold",
            className,
          )}
          {...props}
        />
      );
    },
    CodeHeader,
    SyntaxHighlighter,
  };

  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    />
  );
};

MarkdownTextImpl.displayName = "MarkdownTextImpl";

// Export both named and default component
export const MarkdownText = memo(MarkdownTextImpl);
export default MarkdownText;
