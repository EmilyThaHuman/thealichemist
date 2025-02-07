import { SelectContent } from "@radix-ui/react-select";
import PropTypes from "prop-types";

// First, let's create a custom wrapper for the SelectContent component that prevents scroll jumps
export const ScrollLockSelectContent = ({ children, ...props }) => {
  return (
    <SelectContent
      {...props}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
      }}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
      }}
    >
      {children}
    </SelectContent>
  );
};

ScrollLockSelectContent.displayName = "ScrollLockSelectContent";

ScrollLockSelectContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollLockSelectContent;
