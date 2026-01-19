# Schaeffler DPFC App

A desktop application for Schaeffler DPFC built with Electron.

## Features

- **Professional Header**: Centered "Schaeffler DPFC" branding with logo and login icon
- **Collapsible Sidebar**: Easy navigation with Home, Catalog, My Processes, Feedback, and Support options
- **Main Dashboard**: Five placeholder icon cards for quick access to key features
- **Responsive Design**: Optimized for desktop landscape resolution
- **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
npm install
```

### Adding the Logo (Optional)

For better performance and offline usage, download the Schaeffler logo and place it in the `assets` folder:

```bash
mkdir -p assets
curl -o assets/schaeffler-logo.jpg "https://acam.rwth-campus.com/wp-content/uploads/sites/11/2024/05/Schaeffler-Logo.jpg"
```

The application will automatically use the local logo if available, otherwise it will fall back to the external URL.

### Running the Application

```bash
npm start
```

This will launch the Schaeffler DPFC desktop application.

## Project Structure

- `main.js` - Electron main process
- `index.html` - Application HTML structure
- `styles.css` - Application styling
- `app.js` - Client-side JavaScript for interactivity
- `package.json` - Project dependencies and scripts

## Technologies

- **Electron** - Desktop application framework
- **HTML/CSS/JavaScript** - Core web technologies

## Security

The application follows security best practices:
- Context isolation enabled
- Node integration disabled in renderer process