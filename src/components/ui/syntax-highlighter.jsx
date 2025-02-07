import { makePrismAsyncLightSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter";
import { PrismAsyncLight } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import PropTypes from "prop-types";

// Register supported languages
const registerLanguages = () => {
  const languages = {
    js: jsx,
    jsx: jsx,
    javascript: jsx,
    python: python,
  };

  Object.entries(languages).forEach(([lang, implementation]) => {
    PrismAsyncLight.registerLanguage(lang, implementation);
  });
};

registerLanguages();

// Configure syntax highlighter with custom styles
const syntaxHighlighterConfig = {
  style: coldarkDark,
  customStyle: {
    margin: 0,
    width: "100%",
    background: "transparent",
    padding: "1.5rem 1rem",
  },
};

// Create and export the SyntaxHighlighter component
const SyntaxHighlighter = makePrismAsyncLightSyntaxHighlighter(
  syntaxHighlighterConfig,
);

SyntaxHighlighter.displayName = "SyntaxHighlighter";
SyntaxHighlighter.propTypes = {
  children: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
};

export { SyntaxHighlighter };
export default SyntaxHighlighter;
