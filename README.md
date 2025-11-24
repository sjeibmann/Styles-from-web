# Styles-from-web

A simple vibe code experiment to pull the styles from any web page. This React application allows you to extract and save design styles—including typography, colors, buttons, and links—from any website, making it easy to analyze and reference web design patterns.

## ✨ Features

- **🎨 Style Extraction**: Automatically extracts typography, colors, buttons, and links from any website
- **🔗 Smart URL Handling**: Accepts both full URLs (https://example.com) and domain names (apple.com)
- **💾 Local Storage**: Projects are saved locally in your browser for persistent access
- **🖼️ Favicon Support**: Displays website favicons alongside project titles
- **🗑️ Project Management**: Create, view, and delete style projects with ease
- **📱 Responsive Design**: Built with Material-UI for a modern, mobile-friendly interface
- **⚡ Instant Navigation**: Automatically view extracted styles after project creation

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sjeibmann/Styles-from-web.git
   cd Styles-from-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 App Structure

```
src/
├── components/
│   ├── ProjectCard.jsx       # Displays project preview cards
│   ├── ProjectView.jsx       # Detailed view of extracted styles
│   └── NewProjectForm.jsx    # Form for creating new projects
├── utils/
│   └── styleExtractor.js     # Core logic for extracting website styles
├── App-final.jsx             # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## 🎯 How It Works

1. **Create Project**: Click "Create New Style Project" and enter a website URL
2. **Style Extraction**: The app fetches the website and analyzes its:
   - Typography styles (h1-h6, paragraph tags)
   - Color palette from CSS and inline styles
   - Button styles and interactions
   - Link styles and hover effects
3. **View Results**: Automatically navigate to the project view to see extracted styles
4. **Manage Projects**: View, delete, or create additional projects

## 🔧 Technical Details

### Style Extraction Process

The app uses a multi-step process to extract styles:

1. **URL Fetching**: Utilizes CORS proxies to fetch website content
2. **DOM Parsing**: Creates a temporary DOM to analyze the HTML structure
3. **Style Analysis**: Extracts styles from:
   - Inline CSS attributes
   - CSS class definitions
   - Computed styles (when available)
4. **Data Processing**: Organizes extracted data into structured format

### Key Technologies

- **React 19**: Modern React with hooks and functional components
- **Material-UI (MUI) v7**: Component library for consistent design
- **Vite**: Fast development server and build tool
- **CSS-in-JS**: Styled with MUI's sx prop system

### Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

The app is structured for easy extension:

1. **New Style Types**: Add extraction functions in `src/utils/styleExtractor.js`
2. **UI Components**: Create new components in `src/components/`
3. **Styling**: Use MUI's theme system in `src/App-final.jsx`

## 🐛 Troubleshooting

### Common Issues

1. **Blank Page**: Usually caused by theme configuration errors
2. **CORS Issues**: Some websites may block style extraction
3. **LocalStorage**: Clear browser data if projects don't persist

### Debug Mode

For development, the app includes several debug versions:
- `src/App-simple.jsx` - Minimal functionality
- `src/App-debug6.jsx` - Full features without delete
- `src/App-final.jsx` - Complete application

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using React and Material-UI**
