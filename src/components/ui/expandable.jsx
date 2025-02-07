"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 };

// Create a context with default values
const ExpandableContext = createContext({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: "vertical",
  expandBehavior: "replace",
  transitionDuration: 0.3,
  easeType: "easeInOut",
  initialDelay: 0,
});

// Custom hook to use the ExpandableContext
const useExpandable = () => useContext(ExpandableContext);

// ROOT Expand component
const Expandable = React.forwardRef((props, ref) => {
  const {
    children,
    expanded,
    onToggle,
    transitionDuration = 0.3,
    easeType = "easeInOut",
    expandDirection = "vertical",
    expandBehavior = "replace",
    initialDelay = 0,
    onExpandStart,
    onExpandEnd,
    onCollapseStart,
    onCollapseEnd,
    ...rest
  } = props;

  // Internal state for expansion when the component is uncontrolled
  const [isExpandedInternal, setIsExpandedInternal] = useState(false);

  // Use the provided expanded prop if available, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : isExpandedInternal;

  // Use the provided onToggle function if available, otherwise use internal toggle function
  const toggleExpand =
    onToggle || (() => setIsExpandedInternal((prev) => !prev));

  // Effect to call onExpandStart or onCollapseStart when isExpanded changes
  useEffect(() => {
    if (isExpanded) {
      onExpandStart?.();
    } else {
      onCollapseStart?.();
    }
  }, [isExpanded, onExpandStart, onCollapseStart]);

  // Create the context value to be provided to child components
  const contextValue = {
    isExpanded,
    toggleExpand,
    expandDirection,
    expandBehavior,
    transitionDuration,
    easeType,
    initialDelay,
    onExpandEnd,
    onCollapseEnd,
  };

  return (
    <ExpandableContext.Provider value={contextValue}>
      <motion.div
        ref={ref}
        initial={false}
        animate={{
          transition: {
            duration: transitionDuration,
            ease: easeType,
            delay: initialDelay,
          },
        }}
        {...rest}
      >
        {typeof children === "function" ? children({ isExpanded }) : children}
      </motion.div>
    </ExpandableContext.Provider>
  );
});

// Predefined animation presets
const ANIMATION_PRESETS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -10 },
    transition: { duration: 0.3 },
  },
  "blur-sm": {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
    transition: { duration: 0.3 },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
    transition: { duration: 0.3 },
  },
  "blur-lg": {
    initial: { opacity: 0, filter: "blur(16px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(16px)" },
    transition: { duration: 0.3 },
  },
};

// Wrap this around items in the card that you want to be hidden then animated in on expansion
const ExpandableContent = React.forwardRef((props, ref) => {
  const {
    children,
    preset,
    animateIn,
    animateOut,
    stagger = false,
    staggerChildren = 0.1,
    keepMounted = false,
    ...rest
  } = props;

  const { isExpanded, transitionDuration, easeType } = useExpandable();
  const [measureRef, { height: measuredHeight }] = useMeasure();
  const animatedHeight = useMotionValue(0);
  const smoothHeight = useSpring(animatedHeight, springConfig);

  useEffect(() => {
    if (isExpanded) {
      animatedHeight.set(measuredHeight);
    } else {
      animatedHeight.set(0);
    }
  }, [isExpanded, measuredHeight, animatedHeight]);

  const presetAnimation = preset ? ANIMATION_PRESETS[preset] : {};
  const combinedAnimateIn = {
    ...presetAnimation,
    ...animateIn,
  };
  const combinedAnimateOut = animateOut || combinedAnimateIn;

  return (
    <motion.div
      ref={ref}
      style={{
        height: smoothHeight,
        overflow: "hidden",
      }}
      transition={{ duration: transitionDuration, ease: easeType }}
      {...rest}
    >
      <AnimatePresence initial={false}>
        {(isExpanded || keepMounted) && (
          <motion.div
            ref={measureRef}
            initial={combinedAnimateIn.initial}
            animate={combinedAnimateIn.animate}
            exit={combinedAnimateOut.exit}
            transition={{ duration: transitionDuration, ease: easeType }}
          >
            {stagger ? (
              <motion.div
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: staggerChildren,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {React.Children.map(children, (child, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    {child}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const ExpandableCard = React.forwardRef((props, ref) => {
  const {
    children,
    className = "",
    collapsedSize = { width: 320, height: 211 },
    expandedSize = { width: 480, height: undefined },
    hoverToExpand = false,
    expandDelay = 0,
    collapseDelay = 0,
    ...rest
  } = props;

  const { isExpanded, toggleExpand, expandDirection } = useExpandable();
  const [measureRef, { width, height }] = useMeasure();
  const animatedWidth = useMotionValue(collapsedSize.width || 0);
  const animatedHeight = useMotionValue(collapsedSize.height || 0);
  const smoothWidth = useSpring(animatedWidth, springConfig);
  const smoothHeight = useSpring(animatedHeight, springConfig);

  useEffect(() => {
    if (isExpanded) {
      animatedWidth.set(expandedSize.width || width);
      animatedHeight.set(expandedSize.height || height);
    } else {
      animatedWidth.set(collapsedSize.width || width);
      animatedHeight.set(collapsedSize.height || height);
    }
  }, [
    isExpanded,
    collapsedSize,
    expandedSize,
    width,
    height,
    animatedWidth,
    animatedHeight,
  ]);

  const handleHover = () => {
    if (hoverToExpand && !isExpanded) {
      setTimeout(toggleExpand, expandDelay);
    }
  };

  const handleHoverEnd = () => {
    if (hoverToExpand && isExpanded) {
      setTimeout(toggleExpand, collapseDelay);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn("cursor-pointer", className)}
      style={{
        width:
          expandDirection === "vertical" ? collapsedSize.width : smoothWidth,
        height:
          expandDirection === "horizontal"
            ? collapsedSize.height
            : smoothHeight,
      }}
      transition={springConfig}
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
      {...rest}
    >
      <div
        className={cn(
          "grid grid-cols-1 rounded-lg sm:rounded-xl md:rounded-[2rem]",
          "shadow-[inset_0_0_1px_1px_#ffffff4d] sm:shadow-[inset_0_0_2px_1px_#ffffff4d]",
          "ring-1 ring-black/5",
          "max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] md:max-w-[calc(100%-4rem)]",
          "mx-auto w-full",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="grid grid-cols-1 rounded-lg sm:rounded-xl md:rounded-[2rem] p-1 sm:p-1.5 md:p-2 shadow-md shadow-black/5">
          <div className="rounded-md sm:rounded-lg md:rounded-3xl bg-white p-2 sm:p-3 md:p-4 shadow-xl ring-1 ring-black/5">
            <div className="w-full h-full overflow-hidden">
              <div ref={measureRef} className="flex flex-col h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const ExpandableTrigger = React.forwardRef((props, ref) => {
  const { children, ...rest } = props;
  const { toggleExpand } = useExpandable();
  return (
    <div ref={ref} onClick={toggleExpand} className="cursor-pointer" {...rest}>
      {children}
    </div>
  );
});

const ExpandableCardHeader = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...rest}
    >
      <motion.div layout className="flex justify-between items-start">
        {children}
      </motion.div>
    </div>
  );
});

const ExpandableCardContent = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0 px-4 overflow-hidden flex-grow", className)}
      {...rest}
    >
      <motion.div layout>{children}</motion.div>
    </div>
  );
});

const ExpandableCardFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-4 pt-0", className)}
      {...rest}
    />
  );
});

// Add display names for all components
Expandable.displayName = "Expandable";
ExpandableContent.displayName = "ExpandableContent";
ExpandableCard.displayName = "ExpandableCard";
ExpandableTrigger.displayName = "ExpandableTrigger";
ExpandableCardHeader.displayName = "ExpandableCardHeader";
ExpandableCardContent.displayName = "ExpandableCardContent";
ExpandableCardFooter.displayName = "ExpandableCardFooter";

export {
  Expandable,
  useExpandable,
  ExpandableCard,
  ExpandableContent,
  ExpandableContext,
  ExpandableTrigger,
  ExpandableCardHeader,
  ExpandableCardContent,
  ExpandableCardFooter,
};

/*

# Documentation

## Example Usage

```jsx
"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Battery,
  Bluetooth,
  Calendar,
  Clock,
  Cloud,
  Droplets,
  Fingerprint,
  MapPin,
  MessageSquare,
  Mic,
  ShoppingCart,
  Star,
  Sun,
  Users,
  Video,
  Wind,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable"

// _____________________EXAMPLES______________________
function DesignSyncExample() {
  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
      onExpandStart={() => console.log("Expanding meeting card...")}
      onExpandEnd={() => console.log("Meeting card expanded!")}
    >
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard
            className="w-full relative"
            collapsedSize={{ width: 320, height: 240 }}
            expandedSize={{ width: 420, height: 480 }}
            hoverToExpand={false}
            expandDelay={200}
            collapseDelay={500}
          >
            <ExpandableCardHeader>
              <div className="flex justify-between items-start w-full">
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-100 mb-2"
                  >
                    In 15 mins
                  </Badge>
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                    Design Sync
                  </h3>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Calendar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent>
              <div className="flex flex-col items-start justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>1:30PM → 2:30PM</span>
                </div>

                <ExpandableContent preset="blur-md">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Conference Room A</span>
                  </div>
                </ExpandableContent>
              </div>
              <ExpandableContent preset="blur-md" stagger staggerChildren={0.2}>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                  Weekly design sync to discuss ongoing projects, share updates,
                  and address any design-related challenges.
                </p>
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Attendees:
                  </h4>
                  <div className="flex -space-x-2 overflow-hidden">
                    {["Alice", "Bob", "Charlie", "David"].map((name, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="border-2 border-white dark:border-gray-800">
                              <AvatarImage
                                src={`/placeholder.svg?height=32&width=32&text=${name[0]}`}
                                alt={name}
                              />
                              <AvatarFallback>{name[0]}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                  {isExpanded && (
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Chat
                    </Button>
                  )}
                </div>
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableCardFooter>
              <div className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-300">
                <span>Weekly</span>
                <span>Next: Mon, 10:00 AM</span>
              </div>
            </ExpandableCardFooter>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}

export function ProductShowcaseCard() {
  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      onExpandStart={() => console.log("Expanding product card...")}
      onExpandEnd={() => console.log("Product card expanded!")}
    >
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard
            className="w-full relative"
            collapsedSize={{ width: 330, height: 220 }}
            expandedSize={{ width: 500, height: 520 }}
            hoverToExpand={false}
            expandDelay={500}
            collapseDelay={700}
          >
            <ExpandableCardHeader>
              <div className="flex justify-between items-center">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  New Arrival
                </Badge>
                <Badge variant="outline" className="ml-2">
                  $129.99
                </Badge>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent>
              <div className="flex items-start mb-4">
                <img
                  src="https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505727_rd.jpg;maxHeight=640;maxWidth=550;format=webp"
                  alt="Product"
                  className="object-cover rounded-md mr-4"
                  style={{
                    width: isExpanded ? "120px" : "80px",
                    height: isExpanded ? "120px" : "80px",
                    transition: "width 0.3s, height 0.3s",
                  }}
                />
                <div className="flex-1">
                  <h3
                    className="font-medium text-gray-800 dark:text-white tracking-tight transition-all duration-300"
                    style={{
                      fontSize: isExpanded ? "24px" : "18px",
                      fontWeight: isExpanded ? "700" : "400",
                    }}
                  >
                    Sony Headphones
                  </h3>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <AnimatePresence mode="wait">
                      {isExpanded ? (
                        <motion.span
                          key="expanded"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap"
                        >
                          (128 reviews)
                        </motion.span>
                      ) : (
                        <motion.span
                          key="collapsed"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap"
                        >
                          (128)
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <ExpandableContent
                preset="fade"
                keepMounted={false}
                animateIn={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
                  Experience crystal-clear audio with our latest
                  noise-cancelling technology. Perfect for work, travel, or
                  relaxation.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Battery, text: "30-hour battery life" },
                    { icon: Bluetooth, text: "Bluetooth 5.0" },
                    { icon: Fingerprint, text: "Touch controls" },
                    { icon: Mic, text: "Voice assistant compatible" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <feature.icon className="w-4 h-4 mr-2" />
                      <span>{feature.text}</span>
                    </div>
                  ))}

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <ExpandableCardFooter>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 w-full">
                  <span>Free shipping</span>
                  <span>30-day return policy</span>
                </div>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}

export function WeatherForecastCard() {
  return (
    <Expandable expandDirection="both" expandBehavior="replace">
      <ExpandableTrigger>
        <ExpandableCard
          collapsedSize={{ width: 300, height: 220 }}
          expandedSize={{ width: 500, height: 420 }}
          hoverToExpand={false}
          expandDelay={100}
          collapseDelay={400}
        >
          <ExpandableCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="w-8 h-8 text-yellow-400 mr-2" />
                <ExpandableContent preset="blur-sm" keepMounted={true}>
                  <h3 className="font-medium text-lg">Today's Weather</h3>
                </ExpandableContent>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                72°F
              </Badge>
            </div>
          </ExpandableCardHeader>

          <ExpandableCardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold">72°F</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Feels like 75°F
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Sunny</p>
                <ExpandableContent
                  preset="blur-sm"
                  stagger
                  staggerChildren={0.1}
                  keepMounted={true}
                  animateIn={{
                    initial: { opacity: 0, y: 20, rotate: -5 },
                    animate: { opacity: 1, y: 0, rotate: 0 },
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    High 78° / Low 65°
                  </p>
                </ExpandableContent>
              </div>
            </div>
            <ExpandableContent
              preset="blur-sm"
              stagger
              staggerChildren={0.1}
              keepMounted={true}
              animateIn={{
                initial: { opacity: 0, y: 20, rotate: -5 },
                animate: { opacity: 1, y: 0, rotate: 0 },
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Cloud className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Humidity</span>
                  </div>
                  <span>45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Wind</span>
                  </div>
                  <span>8 mph</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Precipitation</span>
                  </div>
                  <span>0%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">5-Day Forecast</h4>
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                  <div key={day} className="flex justify-between items-center">
                    <span>{day}</span>
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 text-yellow-400 mr-2" />
                      <span>{70 + index}°F</span>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableCardFooter>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: 5 minutes ago
            </p>
          </ExpandableCardFooter>
        </ExpandableCard>
      </ExpandableTrigger>
    </Expandable>
  )
}

function ControlledExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleToggle} className="mb-4">
        {isExpanded ? "Collapse" : "Expand"}
      </Button>

      <Expandable
        expanded={isExpanded}
        onToggle={handleToggle}
        expandDirection="vertical"
        expandBehavior="push"
        onExpandStart={() => toast.info("Expanding controlled card...")}
        onExpandEnd={() => toast.info("Controlled card expanded!")}
      >
        <ExpandableCard
          collapsedSize={{ width: 300, height: 100 }}
          expandedSize={{ width: 300, height: 300 }}
        >
          <ExpandableTrigger>
            <ExpandableCardHeader>
              <h3 className="text-lg font-semibold">
                Controlled Expandable Card
              </h3>
              <Badge variant="secondary">
                {isExpanded ? "Expanded" : "Collapsed"}
              </Badge>
            </ExpandableCardHeader>
          </ExpandableTrigger>
          <ExpandableCardContent>
            <p className="mb-4">
              This card's expanded state is controlled externally.
            </p>
            <ExpandableContent preset="fade" stagger staggerChildren={0.1}>
              <p className="mb-2">This content fades in when expanded.</p>
              <p className="mb-2">
                It uses staggered animation for child elements.
              </p>
              <p>The expansion is controlled by the button above.</p>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableCardFooter>
            <ExpandableContent preset="slide-up">
              <p className="text-sm text-gray-500">
                Footer content slides up when expanded
              </p>
            </ExpandableContent>
          </ExpandableCardFooter>
        </ExpandableCard>
      </Expandable>
    </div>
  )
}

export function ExpandableCardExamples() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col items-center space-y-24">
        <div className="min-h-[480px]">
          <DesignSyncExample />
        </div>
        <div className="flex gap-24 min-h-[600px]">
          <ProductShowcaseCard />
          <WeatherForecastCard />
        </div>
      </div>
    </div>
  )
}
```

*/
