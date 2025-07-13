# Lift HTML Documentation

This is the documentation site for [lift-html](https://github.com/JLarky/lift-html), built with [Astro Starlight](https://starlight.astro.build/).

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# The site will be available at http://localhost:4321
```

### Building for Production

```bash
# Build the site
npm run build

# Preview the build locally
npm run preview
```

## 📁 Project Structure

```
docs/
├── src/
│   ├── content/
│   │   └── docs/           # Documentation pages
│   │       ├── index.md    # Homepage
│   │       ├── getting-started/
│   │       └── guides/
│   ├── assets/             # Images and other assets
│   └── content.config.ts   # Content configuration
├── public/                 # Static assets
├── astro.config.mjs       # Astro configuration
└── package.json
```

## 🌐 Deployment

This documentation site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy-docs.yml`.

### Manual Deployment

If you need to deploy manually:

1. Build the site:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔧 Configuration

### Site Configuration

The site configuration is in `astro.config.mjs`:

- **Base URL**: `/lift-html` (for GitHub Pages)
- **Site URL**: `https://jlarky.github.io`
- **Title**: "Lift HTML Documentation"

### Adding New Pages

1. Create a new `.md` file in `src/content/docs/`
2. Add frontmatter with title and description:

```markdown
---
title: Your Page Title
description: Brief description of the page
---

# Your Page Content

Your documentation content goes here...
```

3. The page will automatically appear in the navigation based on its location in the file structure.

### Customizing the Sidebar

Edit the `sidebar` configuration in `astro.config.mjs` to customize the navigation structure.

## 🎨 Customization

### Styling

The site uses Starlight's default theme. You can customize it by:

1. Creating custom CSS in `src/assets/`
2. Modifying the Starlight theme configuration
3. Adding custom components

### Components

Starlight supports custom components. Place them in `src/components/` and import them in your markdown files.

## 📚 Documentation Content

The documentation covers:

- **Getting Started**: Installation and quick start guides
- **Basic Usage**: Core concepts and fundamentals
- **Components**: Building complex, reusable components
- **Interoperability**: Using lift-html with other frameworks
- **Reference**: API documentation and examples

## 🔍 Search

The site includes full-text search powered by Pagefind. Search indexes are automatically generated during the build process.

## 📱 Responsive Design

The documentation site is fully responsive and works well on desktop, tablet, and mobile devices.

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Make your changes in the `docs/` directory
3. Test locally with `npm run dev`
4. Submit a pull request

## � License

This documentation is part of the lift-html project and follows the same license terms.

## 🔗 Links

- [Lift HTML Repository](https://github.com/JLarky/lift-html)
- [Astro Starlight Documentation](https://starlight.astro.build/)
- [GitHub Pages](https://pages.github.com/)
