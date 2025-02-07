#!/bin/bash

# First, ensure required dependencies are installed
echo "Installing required dependencies..."
npm install -D tailwindcss postcss autoprefixer
npm install @radix-ui/react-icons
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install @hookform/resolvers zod react-hook-form

# Install shadcn-ui CLI globally
echo "Installing shadcn-ui CLI..."
npm install -g shadcn-ui

# Initialize Tailwind CSS if not already initialized
echo "Initializing Tailwind CSS..."
npx tailwindcss init -p

# Initialize shadcn/ui
echo "Initializing shadcn/ui..."
npx shadcn-ui@latest init

# Wait for a moment to ensure initialization is complete
sleep 2

# Array of all available shadcn/ui components
components=(
  "accordion"
  "alert"
  "alert-dialog"
  "aspect-ratio"
  "avatar"
  "badge"
  "button"
  "calendar"
  "card"
  "carousel"
  "checkbox"
  "collapsible"
  "command"
  "context-menu"
  "dialog"
  "drawer"
  "dropdown-menu"
  "form"
  "hover-card"
  "input"
  "label"
  "menubar"
  "navigation-menu"
  "popover"
  "progress"
  "radio-group"
  "scroll-area"
  "select"
  "separator"
  "sheet"
  "skeleton"
  "slider"
  "switch"
  "table"
  "tabs"
  "textarea"
  "toast"
  "toggle"
  "toggle-group"
  "tooltip"
)

# Install each component
for component in "${components[@]}"
do
  echo "Installing @shadcn/ui $component..."
  npx shadcn-ui@latest add "$component" --yes
  
  # Add a small delay between installations to prevent rate limiting
  sleep 1
done

echo "All components have been installed!" 