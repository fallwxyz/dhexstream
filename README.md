# 🚀 DHEXStream

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github)](https://github.com/yourusername/dhexstream)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge&logo=license)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange?style=for-the-badge&logo=version)](package.json)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/php-8.2+-777bb4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)

*A modern anime streaming platform built with React, featuring an elegant UI and seamless viewing experience.*

[Features](#key-features) • [Quick Start](#quick-start) • [Documentation](docs/) • [Contributing](#contributing) • [Support](#support)

</div>

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Modern UI** | Beautiful, responsive interface built with TailwindCSS |
| 📺 **Anime Catalog** | Browse ongoing and completed anime series |
| 🔍 **Search** | Find your favorite anime instantly |
| 📄 **Pagination** | Navigate through large collections effortlessly |
| 🎬 **Episode Tracking** | Track your progress with episode lists |
| 🌙 **Dark Mode** | Easy on the eyes with dark theme support |
| 📱 **Responsive** | Works beautifully on all devices |
| ⚡ **Smooth Animations** | Enhanced with GSAP for fluid transitions |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PHP** 7.4+ (for backend API)
- **Web server** (Apache/Nginx) with mod_rewrite

### Installation

```bash
# Clone the repository
git clone https://github.com/fallwxyz/dhexstream.git
cd dhexstream

# Install frontend dependencies
npm install

# Build for production
npm run build

# Start development server
npm run dev
```

### Configuration

1. Copy the example configuration:
```bash
cp .dhex.example .dhex
```

2. Update your configuration in `.dhex`:
```env
app_url=dhexstream
hostname=localhost

3. Configure your web server to point to the project root

---

## 📖 Usage

### Development

```bash
# Start development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build optimized production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
dhexstream/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── styles/             # Global styles
│   └── App.jsx             # Main app component
├── core/                   # Backend PHP core
├── api.php                 # API endpoint handler
├── assets/                 # Static assets
├── docs/                   # Detailed documentation
└── public/                 # Public static files
```

---

## 📚 Documentation

For detailed guides, API references, and advanced configurations, please see our [Documentation](docs/).

- [Getting Started Guide](docs/getting-started.md)
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌐 Translate to other languages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [PHP](https://www.php.net/) - Backend Language
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [GSAP](https://greensock.com/gsap/) - Animation Library
- [Lucide](https://lucide.dev/) - Beautiful Icons
- [Jikan API](https://jikan.moe/) - MyAnimeList API Wrapper

---