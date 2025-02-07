// svgToJsx.js
import React from "react";

/**
 * Converts SVG attributes to React-compatible props
 * @param {Object} attrs - SVG element attributes
 * @returns {Object} React-compatible props
 */
const convertAttributes = (attrs) => {
  const attributeMap = {
    class: "className",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "aria-hidden": "ariaHidden",
    "aria-label": "ariaLabel",
    viewbox: "viewBox",
  };

  const converted = {};
  for (const [key, value] of Object.entries(attrs)) {
    const reactKey = attributeMap[key.toLowerCase()] || key;
    converted[reactKey] = value;
  }
  return converted;
};

/**
 * Parses SVG string into a DOM element
 * @param {string} svgString - Raw SVG string
 * @returns {Element} Parsed SVG DOM element
 */
const parseSvg = (svgString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc.querySelector("svg");
};

/**
 * Converts SVG element to React props object
 * @param {Element} element - SVG DOM element
 * @returns {Object} React props object
 */
const elementToProps = (element) => {
  const props = {};
  for (const attr of element.attributes) {
    props[attr.name] = attr.value;
  }
  return convertAttributes(props);
};

/**
 * Creates a React component from SVG content
 * @param {string} svgString - Raw SVG string
 * @returns {Function} React component
 */
export const createSvgIcon = (svgString) => {
  // Parse the SVG
  const svgElement = parseSvg(svgString);
  if (!svgElement) {
    throw new Error("Invalid SVG string");
  }

  // Get base props from SVG
  const baseProps = elementToProps(svgElement);

  // Get inner content
  const innerContent = svgElement.innerHTML;
  // Create the component
  const SvgIconComponent = ({ className = "", size = 24, ...props }) => {
    const finalProps = {
      ...baseProps,
      ...props,
      width: size,
      height: size,
      className: `${baseProps.className || ""} ${className}`.trim(),
      style: {
        flexShrink: 0,
        lineHeight: 1,
        ...(props.style || {}),
      },
    };

    return React.createElement("svg", {
      ...finalProps,
      dangerouslySetInnerHTML: { __html: innerContent },
    });
  };

  // Add display name
  SvgIconComponent.displayName = "SvgIconComponent";

  return React.memo(SvgIconComponent);
};

/**
/**
 * Component to convert SVG string to React component inline
 */
export const SvgIcon = React.memo(
  ({ svg, className = "", size = 24, ...props }) => {
    const svgElement = React.useMemo(() => parseSvg(svg), [svg]);

    if (!svgElement) {
      console.error("Invalid SVG string");
      return null;
    }

    const baseProps = elementToProps(svgElement);

    const finalProps = {
      ...baseProps,
      ...props,
      width: size,
      height: size,
      className: `${baseProps.className || ""} ${className}`.trim(),
      style: {
        flexShrink: 0,
        lineHeight: 1,
        ...(props.style || {}),
      },
      dangerouslySetInnerHTML: {
        __html: svgElement.innerHTML,
      },
    };

    return React.createElement("svg", finalProps);
  },
);

// Add display name to fix lint error
SvgIcon.displayName = "SvgIcon";

export default SvgIcon;

// Example usage:
// 1. Create a reusable component:
// const svgString = `<svg fill="currentColor" viewBox="0 0 24 24">
//   <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
// </svg>`;

// export const IconComponent = createSvgIcon(svgString);

// 2. Use inline:
/*
<SvgIcon
  svg={svgString}
  size={32}
  className="text-blue-500"
/>
*/
