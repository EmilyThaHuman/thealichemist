import * as Ariakit from "@ariakit/react";
import { cn } from "@/lib";
import PropTypes from "prop-types";

export const DropdownPopup = ({
  keyPrefix,
  trigger,
  items,
  isOpen,
  setIsOpen,
  menuId,
  modal,
  gutter = 8,
  sameWidth,
  className,
  focusLoop,
  iconClassName,
  itemClassName,
}) => {
  const menu = Ariakit.useMenuStore({
    open: isOpen,
    setOpen: setIsOpen,
    focusLoop,
  });

  return (
    <Ariakit.MenuProvider store={menu}>
      {trigger}
      <Ariakit.Menu
        id={menuId}
        className={cn("popover-ui z-50", className)}
        gutter={gutter}
        modal={modal}
        sameWidth={sameWidth}
      >
        {items
          .filter((item) => item.show !== false)
          .map((item, index) => {
            if (item.separate === true) {
              return (
                <Ariakit.MenuSeparator
                  key={index}
                  className="my-1 h-px bg-white/10"
                />
              );
            }
            return (
              <Ariakit.MenuItem
                key={`${keyPrefix ?? ""}${index}`}
                id={item.id}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-3.5 text-sm text-text-primary outline-none transition-colors duration-200 hover:bg-surface-hover focus:bg-surface-hover md:px-2.5 md:py-2",
                  itemClassName,
                )}
                disabled={item.disabled}
                render={item.render}
                ref={item.ref}
                hideOnClick={item.hideOnClick}
                onClick={(event) => {
                  event.preventDefault();
                  if (item.onClick) {
                    item.onClick(event);
                  }
                  if (item.hideOnClick === false) {
                    return;
                  }
                  menu.hide();
                }}
              >
                {item.icon != null && (
                  <span
                    className={cn("mr-2 size-4", iconClassName)}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}
                {item.label}
                {item.kbd != null && (
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-hover:inline group-focus:inline dark:text-white/50">
                    ⌘{item.kbd}
                  </kbd>
                )}
              </Ariakit.MenuItem>
            );
          })}
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
};

DropdownPopup.displayName = "DropdownPopup";

DropdownPopup.propTypes = {
  keyPrefix: PropTypes.string,
  trigger: PropTypes.node.isRequired,
  items: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  menuId: PropTypes.string.isRequired,
  modal: PropTypes.bool,
  gutter: PropTypes.number,
  sameWidth: PropTypes.bool,
  className: PropTypes.string,
  focusLoop: PropTypes.bool,
  iconClassName: PropTypes.string,
  itemClassName: PropTypes.string,
};

export default DropdownPopup;
