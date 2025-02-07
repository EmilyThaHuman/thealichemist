"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Helper functions for color conversion
const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const normalizeColor = (color) => {
  if (color.startsWith("#")) {
    return color.toUpperCase();
  } else if (color.startsWith("hsl")) {
    const [h, s, l] = color.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0];
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }
  return color;
};

const trimColorString = (color, maxLength = 20) => {
  if (color.length <= maxLength) return color;
  return `${color.slice(0, maxLength - 3)}...`;
};

function ColorPicker({ color, onChange }) {
  const [hsl, setHsl] = useState([0, 0, 0]);
  const [colorInput, setColorInput] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    handleColorChange(color);
  }, [color]);

  const handleColorChange = (newColor) => {
    const normalizedColor = normalizeColor(newColor);
    setColorInput(normalizedColor);

    let h, s, l;
    if (normalizedColor.startsWith("#")) {
      [h, s, l] = hexToHsl(normalizedColor);
    } else {
      [h, s, l] = normalizedColor.match(/\d+(\.\d+)?/g)?.map(Number) || [
        0, 0, 0,
      ];
    }

    setHsl([h, s, l]);
    onChange(`hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`);
  };

  const handleHueChange = (hue) => {
    const newHsl = [hue, hsl[1], hsl[2]];
    setHsl(newHsl);
    handleColorChange(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`);
  };

  const handleSaturationLightnessChange = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const s = Math.round((x / rect.width) * 100);
    const l = Math.round(100 - (y / rect.height) * 100);
    const newHsl = [hsl[0], s, l];
    setHsl(newHsl);
    handleColorChange(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`);
  };

  const handleColorInputChange = (event) => {
    const newColor = event.target.value;
    setColorInput(newColor);
    if (
      /^#[0-9A-Fa-f]{6}$/.test(newColor) ||
      /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/.test(newColor)
    ) {
      handleColorChange(newColor);
    }
  };

  const colorPresets = [
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#4CD964",
    "#5AC8FA",
    "#007AFF",
    "#5856D6",
    "#FF2D55",
    "#8E8E93",
    "#EFEFF4",
    "#E5E5EA",
    "#D1D1D6",
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-left font-normal"
        >
          <div
            className="w-4 h-4 rounded-full mr-2 shadow-sm"
            style={{ backgroundColor: colorInput }}
          />
          <span className="flex-grow">{trimColorString(colorInput)}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <motion.div
            className="w-full h-40 rounded-lg cursor-crosshair relative overflow-hidden"
            style={{
              background: `
                linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
                linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 0, 0, 0)),
                hsl(${hsl[0]}, 100%, 50%)
              `,
            }}
            onClick={handleSaturationLightnessChange}
          >
            <motion.div
              className="w-4 h-4 rounded-full border-2 border-white absolute shadow-md"
              style={{
                left: `${hsl[1]}%`,
                top: `${100 - hsl[2]}%`,
                backgroundColor: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div>
          <motion.input
            type="range"
            min="0"
            max="360"
            value={hsl[0]}
            onChange={(e) => handleHueChange(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%)
              )`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <div className="flex items-center space-x-2">
            <Label htmlFor="color-input" className="sr-only">
              Color
            </Label>
            <Input
              id="color-input"
              type="text"
              value={colorInput}
              onChange={handleColorInputChange}
              className="flex-grow bg-white border border-gray-300 rounded-md text-sm h-8 px-2"
              placeholder="#RRGGBB or hsl(h, s%, l%)"
            />
            <motion.div
              className="w-8 h-8 rounded-md shadow-sm"
              style={{ backgroundColor: colorInput }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            <AnimatePresence>
              {colorPresets.map((preset) => (
                <motion.button
                  key={preset}
                  className="w-8 h-8 rounded-full relative"
                  style={{ backgroundColor: preset }}
                  onClick={() => handleColorChange(preset)}
                  whileHover={{ scale: 1.2, zIndex: 1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {colorInput === preset && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker;

/*

# Documentation


## Example Usage

```jsx
"use client"

import React, { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Lock, LockOpen, Palette, RefreshCw } from "lucide-react"
import { Poline, positionFunctions } from "poline"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import ColorPicker from "../ui/color-picker"

type ColorScheme = {
  [key: string]: string
}

export function ColorPickerDemo() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    card: "0 0% 100%",
    "card-foreground": "240 10% 3.9%",
    popover: "0 0% 100%",
    "popover-foreground": "240 10% 3.9%",
    primary: "240 5.9% 10%",
    "primary-foreground": "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    "secondary-foreground": "240 5.9% 10%",
    muted: "240 4.8% 95.9%",
    "muted-foreground": "240 3.8% 46.1%",
    accent: "240 4.8% 95.9%",
    "accent-foreground": "240 5.9% 10%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "240 5.9% 10%",
  })
  const [lockedColor, setLockedColor] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateHarmoniousColors = useCallback(() => {
    let anchorColors: [number, number, number][] = []

    if (lockedColor) {
      const [h, s, l] = colorScheme[lockedColor].split(" ").map(parseFloat)
      anchorColors.push([h, s / 100, l / 100])
    }

    while (anchorColors.length < 3) {
      anchorColors.push([Math.random() * 360, 0.7, 0.5])
    }

    const poline = new Poline({
      numPoints: 20,
      anchorColors,
      positionFunctionX: positionFunctions.sinusoidalPosition,
      positionFunctionY: positionFunctions.quadraticPosition,
      positionFunctionZ: positionFunctions.linearPosition,
    })

    const newColorScheme = { ...colorScheme }
    const colors = poline.colorsCSS

    Object.keys(newColorScheme).forEach((key, index) => {
      if (key !== lockedColor) {
        const color = colors[index % colors.length]
        const [h, s, l] = color.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0]

        let adjustedLightness = l
        if (key.includes("foreground")) {
          adjustedLightness = Math.min(l - 30, 20)
        } else if (key === "background") {
          adjustedLightness = Math.max(l + 30, 90)
        } else if (key === "border" || key === "input") {
          adjustedLightness = Math.min(Math.max(l, 70), 90)
        }

        newColorScheme[key] = `${h.toFixed(1)} ${s.toFixed(
          1
        )}% ${adjustedLightness.toFixed(1)}%`
      }
    })

    setColorScheme(newColorScheme)
  }, [colorScheme, lockedColor])

  const resetColors = useCallback(() => {
    setColorScheme({
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      "card-foreground": "240 10% 3.9%",
      popover: "0 0% 100%",
      "popover-foreground": "240 10% 3.9%",
      primary: "240 5.9% 10%",
      "primary-foreground": "0 0% 98%",
      secondary: "240 4.8% 95.9%",
      "secondary-foreground": "240 5.9% 10%",
      muted: "240 4.8% 95.9%",
      "muted-foreground": "240 3.8% 46.1%",
      accent: "240 4.8% 95.9%",
      "accent-foreground": "240 5.9% 10%",
      destructive: "0 84.2% 60.2%",
      "destructive-foreground": "0 0% 98%",
      border: "240 5.9% 90%",
      input: "240 5.9% 90%",
      ring: "240 5.9% 10%",
    })
    setLockedColor(null)
  }, [])

  const copyColorScheme = useCallback(() => {
    const cssVariables = Object.entries(colorScheme)
      .map(([key, value]) => `--${key}: ${value};`)
      .join("\n    ")

    const fullCss = `@layer base {
  :root {
    ${cssVariables}
  }
}`

    navigator.clipboard.writeText(fullCss)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [colorScheme])

  const getContrastColor = useCallback((color: string) => {
    const [, , lightness] = color.split(" ").map(parseFloat)
    return lightness > 50 ? "0 0% 0%" : "0 0% 100%"
  }, [])

  const toggleLock = useCallback((key: string) => {
    setLockedColor((prev) => (prev === key ? null : key))
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto ">
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between">
              <Button
                variant="outline"
                onClick={generateHarmoniousColors}
                className="text-sm"
              >
                Generate Harmonious Colors
              </Button>
              <Button
                variant="outline"
                onClick={resetColors}
                className="text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Colors
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(colorScheme).map(([key, value]) => (
                <div key={key} className="relative">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      {key}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => toggleLock(key)}
                    >
                      {lockedColor === key ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <LockOpen className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <ColorPicker
                      color={`hsl(${value})`}
                      onChange={(newColor) => {
                        const [h, s, l] = newColor
                          .match(/\d+(\.\d+)?/g)
                          ?.map(Number) || [0, 0, 0]
                        setColorScheme({
                          ...colorScheme,
                          [key]: `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(
                            1
                          )}%`,
                        })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className="w-full h-full min-h-[24rem] rounded-lg p-6 shadow-lg transition-colors duration-300 ease-in-out overflow-hidden"
            style={{
              backgroundColor: `hsl(${colorScheme.background})`,
              color: `hsl(${colorScheme.foreground})`,
              borderColor: `hsl(${colorScheme.border})`,
              borderWidth: 2,
              borderStyle: "solid",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">Color Preview</h3>
            <p className="text-sm mb-4">
              Experience your color palette in action. This preview showcases
              your selected colors.
            </p>
            <div className="space-y-2">
              {Object.entries(colorScheme).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col md:flex-row gap-4 md:items-center justify-between"
                >
                  <span>{key}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono"
                          onClick={() => {
                            navigator.clipboard.writeText(`--${key}: ${value};`)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          style={{
                            backgroundColor: `hsl(${value})`,
                            color: `hsl(${getContrastColor(value)})`,
                            borderColor: `hsl(${colorScheme.border})`,
                          }}
                        >
                          {value}
                          {copied ? (
                            <Check className="w-4 h-4 ml-2" />
                          ) : (
                            <Copy className="w-4 h-4 ml-2" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </motion.div>
          <Button onClick={copyColorScheme} className="w-full">
            Copy Full Color Scheme
          </Button>
        </div>
      </CardContent>
    </div>
  )
}
```

*/
