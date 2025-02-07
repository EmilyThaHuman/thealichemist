import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useRemark } from "react-remark";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import styled from "styled-components";
import { visit } from "unist-util-visit";
import { FilenameLink } from "./FilenameLink";
import { StepContainerPreActionButtons } from "./StepContainerPreActionButtons";
import { StepContainerPreToolbar } from "./StepContainerPreToolbar";
import { SymbolLink } from "./SymbolLink";
import { SyntaxHighlightedPre } from "./SyntaxHighlightedPre";
import { vscForeground } from "./theme";
import { ctxItemToRifWithContents, getCodeChildrenContent, isJetBrains, patchNestedMarkdown } from "./utils";

const vscEditorBackground = "#1e1e1e";
const vscBackground = "#1e1e1e";
const defaultBorderRadius = "4px";
const getFontSize = () => {
  const fontSize = getComputedStyle(document.documentElement).getPropertyValue(
    "--vscode-editor-font-size"
  );
  return parseInt(fontSize, 10);
};

const StyledMarkdown = styled.div`
  pre {
    display: block;
    background-color: ${vscEditorBackground};
    border-radius: ${defaultBorderRadius};

    max-width: calc(100vw - 24px);
    overflow-x: scroll;
    overflow-y: hidden;

    margin: 10px 0;
    padding: 6px 8px;
  }

  code {
    span.line:empty {
      display: none;
    }
    word-wrap: break-word;
    border-radius: ${defaultBorderRadius};
    background-color: ${vscEditorBackground};
    font-size: ${getFontSize() - 2}px;
    font-family: var(--vscode-editor-font-family);
  }

  code:not(pre > code) {
    font-family: var(--vscode-editor-font-family);
    color: #f78383;
  }

  background-color: ${vscBackground};
  font-family: var(--vscode-font-family), system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
  font-size: ${(props) => props.fontSize || getFontSize()}px;
  padding-left: 8px;
  padding-right: 8px;
  color: ${vscForeground};

  p,
  li,
  ol,
  ul {
    line-height: 1.5;
  }

  > *:first-child {
    margin-top: 8px;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

function processCodeBlocks(tree) {
  const lastNode = tree.children[tree.children.length - 1];
  const lastCodeNode = lastNode.type === "code" ? lastNode : null;

  visit(tree, "code", (codeNode) => {
    if (!codeNode.lang) {
      codeNode.lang = "javascript";
    } else if (codeNode.lang.includes(".")) {
      codeNode.lang = codeNode.lang.split(".").slice(-1)[0];
    }

    codeNode.data = codeNode.data || {};
    codeNode.data.hProperties = codeNode.data.hProperties || {};

    codeNode.data.hProperties["data-isgeneratingcodeblock"] =
      lastCodeNode === codeNode;
    codeNode.data.hProperties["data-codeblockcontent"] = codeNode.value;

    if (codeNode.meta) {
      let meta = codeNode.meta.split(" ");
      codeNode.data.hProperties.filepath = meta[0];
      codeNode.data.hProperties.range = meta[1];
    }
  });
}

const StyledMarkdownPreview = memo(function StyledMarkdownPreview({
  source,
  itemIndex,
  isRenderingInStepContainer,
}) {
  const contextItems = useSelector(
    (state) => state.state.history[itemIndex - 1]?.contextItems
  );
  const symbols = useSelector((state) => state.state.symbols);

  const symbolsRef = useRef([]);
  const contextItemsRef = useRef([]);

  const getLanuageFromClassName = useCallback((className) => {
    if (!className || typeof className !== "string") return null;
    return className
      .split(" ")
      .find((word) => word.startsWith("language-"))
      ?.split("-")[1];
  }, []);

  useEffect(() => {
    contextItemsRef.current = contextItems || [];
  }, [contextItems]);

  useEffect(() => {
    symbolsRef.current = Object.values(symbols).flat();
  }, [symbols]);

  const remarkPlugins = useMemo(
    () => [remarkMath, () => processCodeBlocks],
    []
  );

  const rehypePlugins = useMemo(
    () => [
      [rehypeKatex, {}],
      [rehypeHighlight, {}],
    ],
    []
  );

  const [reactContent, setMarkdownSource] = useRemark({
    remarkPlugins: remarkPlugins,
    rehypePlugins: rehypePlugins,
    rehypeReactOptions: {
      components: {
        a: ({ ...aProps }) => {
          return (
            <a {...aProps} target="_blank" rel="noopener noreferrer">
              {aProps.children}
            </a>
          );
        },
        pre: ({ ...preProps }) => {
          const preChildProps = preProps?.children?.[0]?.props || {};
          const { className, filepath, range } = preChildProps;

          const codeBlockContent = preChildProps["data-codeblockcontent"];
          const isGeneratingCodeBlock =
            preChildProps["data-isgeneratingcodeblock"];

          if (!isRenderingInStepContainer) {
            return <SyntaxHighlightedPre {...preProps} />;
          }

          const language = getLanuageFromClassName(className);

          if (!filepath || isJetBrains()) {
            return (
              <StepContainerPreActionButtons
                language={language}
                codeBlockContent={codeBlockContent}
                codeBlockIndex={preProps.codeBlockIndex}
              >
                <SyntaxHighlightedPre {...preProps} />
              </StepContainerPreActionButtons>
            );
          }

          return (
            <StepContainerPreToolbar
              codeBlockContent={codeBlockContent}
              codeBlockIndex={preProps.codeBlockIndex}
              language={language}
              filepath={filepath}
              isGeneratingCodeBlock={isGeneratingCodeBlock}
              range={range}
            >
              <SyntaxHighlightedPre {...preProps} />
            </StepContainerPreToolbar>
          );
        },
        code: ({ ...codeProps }) => {
          const content = getCodeChildrenContent(codeProps.children);

          if (content && contextItemsRef.current) {
            const ctxItem = contextItemsRef.current.find((ctxItem) =>
              ctxItem.uri?.value.includes(content)
            );
            if (ctxItem) {
              const rif = ctxItemToRifWithContents(ctxItem);
              return <FilenameLink rif={rif} />;
            }

            const exactSymbol = symbolsRef.current.find(
              (s) => s.name === content
            );
            if (exactSymbol) {
              return <SymbolLink content={content} symbol={exactSymbol} />;
            }

            const partialSymbol = symbolsRef.current.find((s) =>
              content.startsWith(s.name)
            );
            if (partialSymbol) {
              return <SymbolLink content={content} symbol={partialSymbol} />;
            }
          }
          return <code {...codeProps}>{codeProps.children}</code>;
        },
      },
    },
  });

  useEffect(() => {
    setMarkdownSource(patchNestedMarkdown(source ?? ""));
  }, [source, setMarkdownSource]);

  return (
    <StyledMarkdown fontSize={getFontSize()}>{reactContent}</StyledMarkdown>
  );
});

StyledMarkdownPreview.propTypes = {
  source: PropTypes.string,
  itemIndex: PropTypes.number.isRequired,
  isRenderingInStepContainer: PropTypes.bool,
};

export default StyledMarkdownPreview;
