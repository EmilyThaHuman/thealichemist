"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const TRANSITION = {
  type: "spring",
  bounce: 0.1,
  duration: 0.4,
};

const FloatingPanelContext = createContext();

function useFloatingPanel() {
  const context = useContext(FloatingPanelContext);
  if (!context) {
    throw new Error(
      "useFloatingPanel must be used within a FloatingPanelProvider",
    );
  }
  return context;
}

function useFloatingPanelLogic() {
  const uniqueId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [triggerRect, setTriggerRect] = useState(null);
  const [title, setTitle] = useState("");

  const openFloatingPanel = (rect) => {
    setTriggerRect(rect);
    setIsOpen(true);
  };
  const closeFloatingPanel = () => {
    setIsOpen(false);
    setNote("");
  };

  return {
    isOpen,
    openFloatingPanel,
    closeFloatingPanel,
    uniqueId,
    note,
    setNote,
    triggerRect,
    title,
    setTitle,
  };
}

export function FloatingPanelRoot({ children, className }) {
  const floatingPanelLogic = useFloatingPanelLogic();

  return (
    <FloatingPanelContext.Provider value={floatingPanelLogic}>
      <MotionConfig transition={TRANSITION}>
        <div className={cn("relative", className)}>{children}</div>
      </MotionConfig>
    </FloatingPanelContext.Provider>
  );
}

export function FloatingPanelTrigger({ children, className, title }) {
  const { openFloatingPanel, uniqueId, setTitle } = useFloatingPanel();
  const triggerRef = useRef(null);

  const handleClick = () => {
    if (triggerRef.current) {
      openFloatingPanel(triggerRef.current.getBoundingClientRect());
      setTitle(title);
    }
  };

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`floating-panel-trigger-${uniqueId}`}
      className={cn(
        "flex h-9 items-center border border-zinc-950/10 bg-white px-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50",
        className,
      )}
      style={{ borderRadius: 8 }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-haspopup="dialog"
      aria-expanded={false}
    >
      <motion.div
        layoutId={`floating-panel-label-container-${uniqueId}`}
        className="flex items-center"
      >
        <motion.span
          layoutId={`floating-panel-label-${uniqueId}`}
          className="text-sm font-semibold"
        >
          {children}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

export function FloatingPanelContent({ children, className }) {
  const { isOpen, closeFloatingPanel, uniqueId, triggerRect, title } =
    useFloatingPanel();
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        closeFloatingPanel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeFloatingPanel]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeFloatingPanel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeFloatingPanel]);

  const variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(4px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40"
          />
          <motion.div
            ref={contentRef}
            layoutId={`floating-panel-${uniqueId}`}
            className={cn(
              "fixed z-50 overflow-hidden border border-zinc-950/10 bg-white shadow-lg outline-none dark:border-zinc-50/10 dark:bg-zinc-800",
              className,
            )}
            style={{
              borderRadius: 12,
              left: triggerRect ? triggerRect.left : "50%",
              top: triggerRect ? triggerRect.bottom + 8 : "50%",
              transformOrigin: "top left",
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`floating-panel-title-${uniqueId}`}
          >
            <FloatingPanelTitle>{title}</FloatingPanelTitle>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FloatingPanelTitle({ children }) {
  const { uniqueId } = useFloatingPanel();

  return (
    <motion.div
      layoutId={`floating-panel-label-container-${uniqueId}`}
      className="px-4 py-2 bg-white dark:bg-zinc-800"
    >
      <motion.div
        layoutId={`floating-panel-label-${uniqueId}`}
        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        id={`floating-panel-title-${uniqueId}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function FloatingPanelForm({ children, onSubmit, className }) {
  const { note, closeFloatingPanel } = useFloatingPanel();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(note);
    closeFloatingPanel();
  };

  return (
    <form
      className={cn("flex h-full flex-col", className)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

export function FloatingPanelLabel({ children, htmlFor, className }) {
  const { note } = useFloatingPanel();

  return (
    <motion.label
      htmlFor={htmlFor}
      style={{ opacity: note ? 0 : 1 }}
      className={cn(
        "block mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      {children}
    </motion.label>
  );
}

export function FloatingPanelTextarea({ className, id }) {
  const { note, setNote } = useFloatingPanel();

  return (
    <textarea
      id={id}
      className={cn(
        "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none",
        className,
      )}
      autoFocus
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  );
}

export function FloatingPanelHeader({ children, className }) {
  return (
    <motion.div
      className={cn(
        "px-4 py-2 font-semibold text-zinc-900 dark:text-zinc-100",
        className,
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelBody({ children, className }) {
  return (
    <motion.div
      className={cn("p-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelFooter({ children, className }) {
  return (
    <motion.div
      className={cn("flex justify-between px-4 py-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelCloseButton({ className }) {
  const { closeFloatingPanel } = useFloatingPanel();

  return (
    <motion.button
      type="button"
      className={cn("flex items-center", className)}
      onClick={closeFloatingPanel}
      aria-label="Close floating panel"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ArrowLeftIcon size={16} className="text-zinc-900 dark:text-zinc-100" />
    </motion.button>
  );
}

export function FloatingPanelSubmitButton({ className }) {
  return (
    <motion.button
      className={cn(
        "relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className,
      )}
      type="submit"
      aria-label="Submit note"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Submit Note
    </motion.button>
  );
}

export function FloatingPanelButton({ children, onClick, className }) {
  return (
    <motion.button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700",
        className,
      )}
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

export {
  FloatingPanelBody as Body,
  FloatingPanelButton as Button,
  FloatingPanelCloseButton as CloseButton,
  FloatingPanelContent as Content,
  FloatingPanelFooter as Footer,
  FloatingPanelForm as Form,
  FloatingPanelHeader as Header,
  FloatingPanelLabel as Label,
  FloatingPanelRoot as Root,
  FloatingPanelSubmitButton as SubmitButton,
  FloatingPanelTextarea as Textarea,
  FloatingPanelTrigger as Trigger,
};

/*

# Documentation


## Example Usage

```jsx
"use client"

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Image as ImageIcon, Paintbrush, Plus, X } from "lucide-react"

import {
  FloatingPanelBody,
  FloatingPanelButton,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelHeader,
  FloatingPanelLabel,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from "../ui/floating-panel"

function FloatingPanelInput() {
  const handleSubmit = (note: string) => {
    console.log("Submitted note:", note)
  }

  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title="Add Note"
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <span>Add Note</span>
      </FloatingPanelTrigger>
      <FloatingPanelContent className="w-80">
        <FloatingPanelForm onSubmit={handleSubmit}>
          <FloatingPanelBody>
            <FloatingPanelLabel htmlFor="note-input">Note</FloatingPanelLabel>
            <FloatingPanelTextarea id="note-input" className="min-h-[100px]" />
          </FloatingPanelBody>
          <FloatingPanelFooter>
            <FloatingPanelCloseButton />
            <FloatingPanelSubmitButton />
          </FloatingPanelFooter>
        </FloatingPanelForm>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  )
}

const ColorPickerFloatingPanel = () => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33F1",
    "#33FFF1",
    "#F1FF33",
  ]

  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title="Choose Color"
        className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
      >
        <span>Choose Color</span>
      </FloatingPanelTrigger>
      <FloatingPanelContent className="w-64">
        <FloatingPanelBody>
          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence>
              {colors.map((color) => (
                <motion.button
                  key={color}
                  className="w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  style={{ backgroundColor: color }}
                  onClick={() => console.log(`Selected color: ${color}`)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </AnimatePresence>
          </div>
        </FloatingPanelBody>
        <FloatingPanelFooter>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  )
}

const QuickActionsFloatingPanel = () => {
  const actions = [
    {
      icon: <Plus className="w-4 h-4" />,
      label: "New File",
      action: () => console.log("New File"),
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      label: "Upload Image",
      action: () => console.log("Upload Image"),
    },
    {
      icon: <Paintbrush className="w-4 h-4" />,
      label: "Edit Colors",
      action: () => console.log("Edit Colors"),
    },
  ]

  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title="Quick Actions"
        className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
      >
        <span>Quick Actions</span>
      </FloatingPanelTrigger>
      <FloatingPanelContent className="w-56">
        <FloatingPanelBody>
          <AnimatePresence>
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingPanelButton
                  onClick={action.action}
                  className="w-full flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-muted transition-colors"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </FloatingPanelButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </FloatingPanelBody>
        <FloatingPanelFooter>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  )
}

const ImagePreviewFloatingPanel = () => {
  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title="Preview Image"
        className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
      >
        <span>Preview Image</span>
      </FloatingPanelTrigger>
      <FloatingPanelContent className="w-80">
        <FloatingPanelBody>
          <motion.img
            src="/placeholder.svg?height=200&width=300"
            alt="Preview"
            className="w-full h-auto rounded-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Image preview description goes here.
          </motion.p>
        </FloatingPanelBody>
        <FloatingPanelFooter>
          <FloatingPanelCloseButton />
          <FloatingPanelButton
            onClick={() => console.log("Download clicked")}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Download
          </FloatingPanelButton>
        </FloatingPanelFooter>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  )
}

export function FloatingPanelExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">FloatingPanel Examples</h1>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <FloatingPanelInput />
        <ColorPickerFloatingPanel />
        <QuickActionsFloatingPanel />
        <ImagePreviewFloatingPanel />
      </div>
    </div>
  )
}
```

*/
