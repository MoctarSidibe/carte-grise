# 🇬🇦 Gabon Theme Guide - CGA Application

## Official Gabonese Flag Colors

This guide documents the Gabon theme implementation throughout the CGA application.

---

## Color Palette

### Primary Colors (From Gabonese Flag)

```css
/* Green - Vert */
--gabon-green: #009E60;
--gabon-green-light: #4CAF88;
--gabon-green-dark: #007045;

/* Yellow - Jaune */
--gabon-yellow: #FCD116;
--gabon-yellow-light: #FFE066;
--gabon-yellow-dark: #E8BE0E;

/* Blue - Bleu */
--gabon-blue: #3A75C4;
--gabon-blue-light: #6B9DD6;
--gabon-blue-dark: #285491;
```

### Official Flag Representation

```
┌────────────────────────────┐
│         GREEN              │ Forests and Hope
├────────────────────────────┤
│         YELLOW             │ Sun and Equator
├────────────────────────────┤
│         BLUE               │ Atlantic Ocean
└────────────────────────────┘
```

---

## Usage in Application

### 1. Gradients

**Tricolor Gradient (Main):**
```css
background: linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%);
```

**Usage:**
- Login page background
- Main buttons
- AppBar (horizontal)
- Cards and containers

### 2. Flag Stripes Decoration

**Horizontal Stripes:**
```jsx
<Box sx={{ display: 'flex', height: 4 }}>
  <Box sx={{ flex: 1, background: '#009E60' }} />
  <Box sx={{ flex: 1, background: '#FCD116' }} />
  <Box sx={{ flex: 1, background: '#3A75C4' }} />
</Box>
```

**Where Applied:**
- Top of Login card
- Bottom of Login card
- Top of Drawer navigation
- Bottom of AppBar
- Dashboard Progress widget

### 3. Material-UI Theme

**Theme Configuration (App.js):**
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#009E60',      // Gabon Green
      light: '#4CAF88',
      dark: '#007045',
    },
    secondary: {
      main: '#3A75C4',      // Gabon Blue
      light: '#6B9DD6',
      dark: '#285491',
    },
    gabon: {
      green: '#009E60',
      yellow: '#FCD116',
      blue: '#3A75C4',
    },
  },
});
```

### 4. Button Styling

**Gradient Buttons:**
```javascript
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #007045 0%, #E8BE0E 50%, #285491 100%)',
    },
  }}
>
  Se connecter
</Button>
```

### 5. Typography with Gradient

**Gradient Text:**
```javascript
<Typography
  sx={{
    background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  CGA
</Typography>
```

---

## Component Examples

### Login Page

```javascript
// Background
<Box sx={{
  background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
}}>
  {/* Top Stripe */}
  <Box sx={{ display: 'flex', height: 8 }}>
    <Box sx={{ flex: 1, background: '#009E60' }} />
    <Box sx={{ flex: 1, background: '#FCD116' }} />
    <Box sx={{ flex: 1, background: '#3A75C4' }} />
  </Box>

  {/* Avatar with Gradient */}
  <Avatar sx={{
    background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
  }}>
    <DirectionsCar />
  </Avatar>

  {/* CGA Title */}
  <Typography sx={{
    background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}>
    CGA
  </Typography>
</Box>
```

### Dashboard Cards

```javascript
<StatCard
  title="En Attente"
  value="24"
  icon={<PendingActions />}
  color="#F57C00"  // Orange for pending
/>

<StatCard
  title="Approuvées"
  value="156"
  icon={<CheckCircle />}
  color="#009E60"  // Gabon Green for approved
/>
```

### Progress Widget

```javascript
<Paper sx={{
  background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
  color: 'white',
}}>
  {/* Top Stripe */}
  <Box sx={{ display: 'flex', height: 4 }}>
    <Box sx={{ flex: 1, background: '#009E60' }} />
    <Box sx={{ flex: 1, background: '#FCD116' }} />
    <Box sx={{ flex: 1, background: '#3A75C4' }} />
  </Box>

  <LinearProgress
    sx={{
      backgroundColor: 'rgba(255,255,255,0.3)',
      '& .MuiLinearProgress-bar': {
        backgroundColor: 'white',
      },
    }}
  />
</Paper>
```

---

## Best Practices

### 1. Consistency

✅ **DO:**
- Use exact hex codes (#009E60, #FCD116, #3A75C4)
- Maintain gradient direction (135deg)
- Keep stripe order (Green → Yellow → Blue)

❌ **DON'T:**
- Use similar but different colors
- Change gradient direction
- Alter stripe order

### 2. Accessibility

✅ **Ensure:**
- Sufficient color contrast for text
- Green (#009E60) on white background: ✅ Pass
- Blue (#3A75C4) on white background: ✅ Pass
- Yellow (#FCD116) on white background: ⚠️ Use dark text

### 3. Responsive Design

```javascript
// Adjust stripe height for mobile
<Box sx={{
  height: { xs: 4, md: 8 }  // Smaller on mobile
}}>
```

### 4. Performance

- Use CSS gradients (not images)
- Avoid excessive animations on gradients
- Cache gradient definitions

---

## Customization Guide

### Adding New Components

```javascript
// Template for new Gabon-themed component
const GabonComponent = () => (
  <Box>
    {/* Stripe decoration */}
    <Box sx={{ display: 'flex', height: 4 }}>
      <Box sx={{ flex: 1, background: '#009E60' }} />
      <Box sx={{ flex: 1, background: '#FCD116' }} />
      <Box sx={{ flex: 1, background: '#3A75C4' }} />
    </Box>

    {/* Your content */}
    <Box sx={{
      borderLeft: '4px solid #009E60',  // Green accent
    }}>
      Content here
    </Box>
  </Box>
);
```

### Alternative Accent Colors

When Gabon colors don't work (e.g., error states):
- **Success:** Use #2E7D32 (Material-UI green)
- **Error:** Use #D32F2F (Material-UI red)
- **Warning:** Use #F57C00 (Material-UI orange)
- **Info:** Use #0288D1 (Material-UI blue)

But prefer Gabon green (#009E60) for positive states when possible.

---

## CSS Variables (Optional Enhancement)

```css
:root {
  --gabon-green: #009E60;
  --gabon-yellow: #FCD116;
  --gabon-blue: #3A75C4;
  --gabon-gradient: linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%);
}
```

---

## Traefik Custom Headers

The Gabon theme is even in HTTP headers!

```yaml
# traefik/dynamic/middlewares.yml
gabon-theme:
  headers:
    customResponseHeaders:
      X-Theme-Primary: "#009E60"
      X-Theme-Secondary: "#3A75C4"
      X-Theme-Accent: "#FCD116"
      X-Country: "Gabon"
```

---

## Resources

- **Gabonese Flag:** Official government specifications
- **Color Picker:** Use exact hex codes
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**🇬🇦 Vive le Gabon! 🇬🇦**

**For the Gabonese Republic - Built with national pride!**
