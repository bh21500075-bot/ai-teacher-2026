

# Plan: Update Color Theme to UTB Brand Colors

## Overview
Update the project's color scheme to match the University of Technology Bahrain (UTB) brand colors: **Slate (dark gray)**, **Red (crimson)**, and **White**.

## UTB Color Palette (HSL Values)

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| Slate/Charcoal | `#3d3d3d` | `0 0% 24%` | Sidebar, headers, dark elements |
| UTB Red | `#c8102e` | `350 85% 42%` | Primary buttons, accents, links |
| White | `#ffffff` | `0 0% 100%` | Backgrounds, cards |
| Light Gray | `#f5f5f5` | `0 0% 96%` | Secondary backgrounds |

## Changes to Make

### File: `src/index.css`

Update CSS variables to use UTB colors:

**Light Mode (`:root`)**
```css
:root {
  /* UTB Theme Colors */
  --background: 0 0% 97%;           /* Light gray background */
  --foreground: 0 0% 15%;           /* Dark text */

  --card: 0 0% 100%;                /* White cards */
  --card-foreground: 0 0% 15%;

  /* Primary: UTB Red */
  --primary: 350 85% 42%;           /* #c8102e */
  --primary-foreground: 0 0% 100%;

  /* Secondary: Light Gray */
  --secondary: 0 0% 94%;
  --secondary-foreground: 0 0% 24%;

  --muted: 0 0% 94%;
  --muted-foreground: 0 0% 45%;

  /* Accent: UTB Red (lighter) */
  --accent: 350 75% 50%;
  --accent-foreground: 0 0% 100%;

  --destructive: 0 75% 55%;
  --destructive-foreground: 0 0% 100%;

  --border: 0 0% 88%;
  --input: 0 0% 88%;
  --ring: 350 85% 42%;

  /* Sidebar - UTB Slate/Charcoal */
  --sidebar-background: 0 0% 24%;   /* Dark slate */
  --sidebar-foreground: 0 0% 96%;
  --sidebar-primary: 0 0% 100%;
  --sidebar-primary-foreground: 0 0% 24%;
  --sidebar-accent: 350 85% 42%;    /* UTB Red accent */
  --sidebar-accent-foreground: 0 0% 100%;
  --sidebar-border: 0 0% 30%;
  --sidebar-ring: 350 85% 42%;

  /* Chat colors */
  --chat-user: 350 85% 42%;         /* UTB Red for user messages */
  --chat-ai: 0 0% 94%;              /* Light gray for AI messages */
}
```

**Dark Mode (`.dark`)**
```css
.dark {
  --background: 0 0% 8%;
  --foreground: 0 0% 96%;

  --card: 0 0% 12%;
  --card-foreground: 0 0% 96%;

  --primary: 350 75% 50%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 18%;
  --secondary-foreground: 0 0% 96%;

  /* ... similar updates for dark mode ... */

  --sidebar-background: 0 0% 10%;
  --sidebar-accent: 350 75% 45%;
}
```

## Visual Preview

```text
┌─────────────────────────────────────────────────────┐
│ ┌──────────┐                                        │
│ │ SIDEBAR  │  ┌─────────────────────────────────┐   │
│ │ (Slate)  │  │  Content Area (White/Light)     │   │
│ │ #3d3d3d  │  │                                 │   │
│ │          │  │  ┌─────────────────────────┐    │   │
│ │ ● Active │  │  │ [RED BUTTON] Primary    │    │   │
│ │   (Red)  │  │  └─────────────────────────┘    │   │
│ │          │  │                                 │   │
│ └──────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update all CSS color variables to UTB palette |

## Color Mapping Summary

| Element | Current Color | New UTB Color |
|---------|---------------|---------------|
| Primary (buttons, links) | Blue `#1a5490` | Red `#c8102e` |
| Sidebar background | Dark Blue | Slate/Charcoal `#3d3d3d` |
| Sidebar accent | Blue | Red `#c8102e` |
| Background | Light blue-gray | Light gray/white |
| Borders | Blue-tinted gray | Neutral gray |

