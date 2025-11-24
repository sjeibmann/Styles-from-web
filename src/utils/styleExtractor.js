const extractFavicon = (dom, baseUrl) => {
  try {
    // Try multiple methods to find the favicon
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];
    
    for (const selector of faviconSelectors) {
      const link = dom.querySelector(selector);
      if (link) {
        let faviconUrl = link.getAttribute('href');
        if (faviconUrl) {
          // Convert relative URL to absolute
          if (faviconUrl.startsWith('/')) {
            const url = new URL(baseUrl);
            faviconUrl = `${url.protocol}//${url.host}${faviconUrl}`;
          } else if (faviconUrl.startsWith('//')) {
            const url = new URL(baseUrl);
            faviconUrl = `${url.protocol}${faviconUrl}`;
          } else if (!faviconUrl.startsWith('http')) {
            const url = new URL(baseUrl);
            faviconUrl = `${url.protocol}//${url.host}/${faviconUrl}`;
          }
          return faviconUrl;
        }
      }
    }
    
    // Fallback to default favicon location
    try {
      const url = new URL(baseUrl);
      return `${url.protocol}//${url.host}/favicon.ico`;
    } catch (err) {
      console.warn('Could not construct fallback favicon URL:', err);
    }
    
  } catch (error) {
    console.warn('Error extracting favicon:', error);
  }
  
  return null;
};

export const extractStylesFromUrl = async (inputUrl) => {
  try {
    // Validate and format URL
    if (!inputUrl || inputUrl.trim() === '') {
      throw new Error('Invalid URL format');
    }

    // Clean and format the URL
    let url = inputUrl.trim();
    
    // Remove any leading/trailing spaces and newlines
    url = url.replace(/^\s+|\s+$/g, '');
    
    // If URL doesn't start with http:// or https://, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format');
    }

    // Try multiple CORS proxies for better reliability
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`
    ];

    let html = '';
    let lastError = null;

    for (const proxyUrl of proxies) {
      try {
        console.log('Trying proxy:', proxyUrl);
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          html = await response.text();
          if (html && html.length > 100) { // Ensure we got meaningful content
            break;
          }
        }
      } catch (err) {
        console.warn(`Proxy ${proxyUrl} failed:`, err);
        lastError = err;
        continue;
      }
    }

    if (!html) {
      throw new Error(lastError?.message || 'Failed to fetch website content from all proxies');
    }
    
    // Create a temporary DOM to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract title
    const title = tempDiv.querySelector('title')?.textContent || 
                  tempDiv.querySelector('h1')?.textContent || 
                  new URL(url).hostname;
    
    // Extract favicon
    const favicon = extractFavicon(tempDiv, url);
    
    // Extract colors from styles
    const colors = extractColors(tempDiv);
    
    // Extract typography styles
    const typeStyles = extractTypeStyles(tempDiv);
    
    // Extract button styles
    const buttonStyles = extractButtonStyles(tempDiv);
    
    // Extract link styles
    const linkStyles = extractLinkStyles(tempDiv);

    return {
      title,
      url, // Return the formatted full URL
      favicon,
      colors,
      typeStyles,
      buttonStyles,
      linkStyles,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting styles:', error);
    throw new Error(`Failed to extract styles: ${error.message}`);
  }
};

const extractColors = (dom) => {
  const colors = new Set();
  const colorRegex = /#([0-9a-f]{3}|[0-9a-f]{6})\b|rgb\((\d+,\s*\d+,\s*\d+)\)|rgba\((\d+,\s*\d+,\s*\d+,\s*[\d.]+)\)/gi;
  
  // Extract from inline styles
  const elementsWithStyles = dom.querySelectorAll('[style]');
  elementsWithStyles.forEach(el => {
    const style = el.getAttribute('style');
    const matches = style.match(colorRegex);
    if (matches) {
      matches.forEach(color => colors.add(color));
    }
  });
  
  // Extract from style tags
  const styleTags = dom.querySelectorAll('style');
  styleTags.forEach(tag => {
    const styleText = tag.textContent;
    const matches = styleText.match(colorRegex);
    if (matches) {
      matches.forEach(color => colors.add(color));
    }
  });
  
  // Add some common colors if none found
  if (colors.size === 0) {
    return ['#000000', '#ffffff', '#646cff', '#f9f9f9'];
  }
  
  return Array.from(colors).slice(0, 20); // Limit to 20 colors
};

const extractTypeStyles = (dom) => {
  const typeStyles = [];
  
  try {
    // Extract styles from h1 through h6 tags in order
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const sampleTexts = {
      'h1': 'Main Heading Text',
      'h2': 'Secondary Heading Text', 
      'h3': 'Third Level Heading',
      'h4': 'Fourth Level Heading',
      'h5': 'Fifth Level Heading',
      'h6': 'Sixth Level Heading'
    };
    
    headingTags.forEach(tag => {
      const elements = dom.querySelectorAll(tag);
      const elementArray = Array.from(elements || []);
      
      if (elementArray.length > 0) {
        const firstElement = elementArray[0];
        
        // Extract inline styles
        const inlineStyles = firstElement.getAttribute('style') || '';
        const styles = {};
        inlineStyles.split(';').forEach(style => {
          const [property, value] = style.split(':').map(s => s.trim());
          if (property && value) {
            styles[property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
          }
        });
        
        // Extract class names for potential CSS styles
        const className = firstElement.className || '';
        
        // Try to extract CSS styles from style tags
        let cssStyles = {};
        try {
          const styleTags = dom.querySelectorAll('style');
          styleTags.forEach(styleTag => {
            const cssText = styleTag.textContent || '';
            // Look for CSS rules that match this element's classes
            const classes = className.split(' ').filter(c => c.trim());
            classes.forEach(cls => {
              // Simple regex to find CSS rules for this class
              const classRegex = new RegExp(`\\.${cls}\\s*{([^}]+)}`, 'gi');
              const match = classRegex.exec(cssText);
              if (match && match[1]) {
                const cssDeclarations = match[1];
                cssDeclarations.split(';').forEach(decl => {
                  const [property, value] = decl.split(':').map(s => s.trim());
                  if (property && value) {
                    const camelCaseProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    cssStyles[camelCaseProp] = value;
                  }
                });
              }
            });
          });
        } catch (err) {
          console.warn('Could not extract CSS styles:', err);
        }
        
        // Create a comprehensive style object with better defaults
        const extractedStyle = {
          tag,
          text: sampleTexts[tag],
          fontSize: styles.fontSize || cssStyles.fontSize || getDefaultSizeForTag(tag),
          fontFamily: styles.fontFamily || cssStyles.fontFamily || 'system-ui, -apple-system, sans-serif',
          fontWeight: styles.fontWeight || cssStyles.fontWeight || getDefaultWeightForTag(tag),
          lineHeight: styles.lineHeight || cssStyles.lineHeight || getDefaultLineHeightForTag(tag),
          color: styles.color || cssStyles.color || getDefaultColorForTag(tag),
          textTransform: styles.textTransform || cssStyles.textTransform || 'none',
          letterSpacing: styles.letterSpacing || cssStyles.letterSpacing || 'normal',
          textDecoration: styles.textDecoration || cssStyles.textDecoration || 'none',
          className: className,
          actualText: firstElement.textContent?.trim() || ''
        };
        
        typeStyles.push(extractedStyle);
      }
    });
    
    // Also extract paragraph styles if available
    const pElements = dom.querySelectorAll('p');
    const pArray = Array.from(pElements || []);
    
    if (pArray.length > 0) {
      const firstP = pArray[0];
      
      const inlineStyles = firstP.getAttribute('style') || '';
      const styles = {};
      inlineStyles.split(';').forEach(style => {
        const [property, value] = style.split(':').map(s => s.trim());
        if (property && value) {
          styles[property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
        }
      });
      
      // Try to extract CSS styles for paragraph
      let cssStyles = {};
      try {
        const styleTags = dom.querySelectorAll('style');
        styleTags.forEach(styleTag => {
          const cssText = styleTag.textContent || '';
          const className = firstP.className || '';
          const classes = className.split(' ').filter(c => c.trim());
          classes.forEach(cls => {
            const classRegex = new RegExp(`\\.${cls}\\s*{([^}]+)}`, 'gi');
            const match = classRegex.exec(cssText);
            if (match && match[1]) {
              const cssDeclarations = match[1];
              cssDeclarations.split(';').forEach(decl => {
                const [property, value] = decl.split(':').map(s => s.trim());
                if (property && value) {
                  const camelCaseProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                  cssStyles[camelCaseProp] = value;
                }
              });
            }
          });
        });
      } catch (err) {
        console.warn('Could not extract CSS styles for paragraph:', err);
      }
      
      typeStyles.push({
        tag: 'p',
        text: 'This is paragraph text that demonstrates the body typography styling from the website.',
        fontSize: styles.fontSize || cssStyles.fontSize || '16px',
        fontFamily: styles.fontFamily || cssStyles.fontFamily || 'system-ui, -apple-system, sans-serif',
        fontWeight: styles.fontWeight || cssStyles.fontWeight || '400',
        lineHeight: styles.lineHeight || cssStyles.lineHeight || '1.6',
        color: styles.color || cssStyles.color || '#374151',
        textTransform: styles.textTransform || cssStyles.textTransform || 'none',
        letterSpacing: styles.letterSpacing || cssStyles.letterSpacing || 'normal',
        textDecoration: styles.textDecoration || cssStyles.textDecoration || 'none',
        actualText: firstP.textContent?.trim() || ''
      });
    }
    
  } catch (error) {
    console.warn('Error extracting type styles:', error);
  }
  
  // Helper functions for default values with more variety
  function getDefaultSizeForTag(tag) {
    const sizes = {
      'h1': '36px', 'h2': '30px', 'h3': '24px', 
      'h4': '20px', 'h5': '18px', 'h6': '16px'
    };
    return sizes[tag] || '16px';
  }
  
  function getDefaultWeightForTag(tag) {
    const weights = {
      'h1': '800', 'h2': '700', 'h3': '600', 
      'h4': '600', 'h5': '500', 'h6': '500'
    };
    return weights[tag] || '400';
  }
  
  function getDefaultLineHeightForTag(tag) {
    const lineHeights = {
      'h1': '1.1', 'h2': '1.2', 'h3': '1.3', 
      'h4': '1.4', 'h5': '1.5', 'h6': '1.5'
    };
    return lineHeights[tag] || '1.6';
  }
  
  function getDefaultColorForTag(tag) {
    const colors = {
      'h1': '#000000', 'h2': '#111111', 'h3': '#222222',
      'h4': '#333333', 'h5': '#444444', 'h6': '#666666'
    };
    return colors[tag] || '#333333';
  }
  
  // If no styles found or error occurred, provide defaults with more variety
  if (typeStyles.length === 0) {
    return [
      {
        tag: 'h1',
        text: 'Main Heading Example',
        fontSize: '36px',
        fontFamily: 'Georgia, serif',
        fontWeight: '800',
        lineHeight: '1.1',
        color: '#000000',
        textTransform: 'none',
        letterSpacing: '-0.02em',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'h2', 
        text: 'Secondary Heading Example',
        fontSize: '30px',
        fontFamily: 'Georgia, serif',
        fontWeight: '700',
        lineHeight: '1.2',
        color: '#111111',
        textTransform: 'none',
        letterSpacing: '-0.01em',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'h3',
        text: 'Third Level Heading',
        fontSize: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '600',
        lineHeight: '1.3',
        color: '#222222',
        textTransform: 'none',
        letterSpacing: 'normal',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'h4',
        text: 'Fourth Level Heading',
        fontSize: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '600',
        lineHeight: '1.4',
        color: '#333333',
        textTransform: 'none',
        letterSpacing: 'normal',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'h5',
        text: 'Fifth Level Heading',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        lineHeight: '1.5',
        color: '#444444',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'h6',
        text: 'Sixth Level Heading',
        fontSize: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        lineHeight: '1.5',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textDecoration: 'none',
        actualText: ''
      },
      {
        tag: 'p',
        text: 'This is paragraph text that demonstrates the body typography styling from the website.',
        fontSize: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '400',
        lineHeight: '1.6',
        color: '#333333',
        textTransform: 'none',
        letterSpacing: 'normal',
        textDecoration: 'none',
        actualText: ''
      }
    ];
  }
  
  return typeStyles;
};

const extractButtonStyles = (dom) => {
  const buttonStyles = [];
  
  try {
    const buttons = dom.querySelectorAll('button, input[type="button"], input[type="submit"], .btn, [role="button"]');
    
    // Convert NodeList to Array and handle edge cases
    const buttonArray = Array.from(buttons || []);
    
    if (buttonArray.length > 0) {
      buttonArray.slice(0, 5).forEach(button => {
        // Extract inline styles
        const inlineStyles = button.getAttribute('style') || '';
        const styles = {};
        inlineStyles.split(';').forEach(style => {
          const [property, value] = style.split(':').map(s => s.trim());
          if (property && value) {
            styles[property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
          }
        });
        
        buttonStyles.push({
          text: button.textContent || button.value || 'Button',
          backgroundColor: styles.backgroundColor || '#3b82f6',
          color: styles.color || '#ffffff',
          border: styles.border || 'none',
          borderRadius: styles.borderRadius || '6px',
          padding: styles.padding || '10px 20px',
          fontSize: styles.fontSize || '14px',
          fontFamily: styles.fontFamily || 'system-ui, -apple-system, sans-serif',
          fontWeight: styles.fontWeight || '500',
          textTransform: styles.textTransform || 'none',
          boxShadow: styles.boxShadow || 'none',
          letterSpacing: styles.letterSpacing || 'normal',
          cursor: styles.cursor || 'pointer'
        });
      });
    }
  } catch (error) {
    console.warn('Error extracting button styles:', error);
  }
  
  // If no buttons found or error occurred, provide defaults
  if (buttonStyles.length === 0) {
    return [
      {
        text: 'Primary Button',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        textTransform: 'none',
        boxShadow: 'none',
        letterSpacing: 'normal',
        cursor: 'pointer'
      },
      {
        text: 'Secondary Button',
        backgroundColor: '#f1f5f9',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        textTransform: 'none',
        boxShadow: 'none',
        letterSpacing: 'normal',
        cursor: 'pointer'
      }
    ];
  }
  
  return buttonStyles;
};

const extractLinkStyles = (dom) => {
  const linkStyles = [];
  
  try {
    const links = dom.querySelectorAll('a[href]');
    
    // Convert NodeList to Array and handle edge cases
    const linkArray = Array.from(links || []);
    
    if (linkArray.length > 0) {
      linkArray.slice(0, 5).forEach(link => {
        // Extract inline styles
        const inlineStyles = link.getAttribute('style') || '';
        const styles = {};
        inlineStyles.split(';').forEach(style => {
          const [property, value] = style.split(':').map(s => s.trim());
          if (property && value) {
            styles[property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
          }
        });
        
        linkStyles.push({
          text: link.textContent?.slice(0, 30) + (link.textContent?.length > 30 ? '...' : '') || 'Example link',
          color: styles.color || '#3b82f6',
          textDecoration: styles.textDecoration || 'underline',
          fontSize: styles.fontSize || '14px',
          fontWeight: styles.fontWeight || '500'
        });
      });
    }
  } catch (error) {
    console.warn('Error extracting link styles:', error);
  }
  
  // If no links found or error occurred, provide defaults
  if (linkStyles.length === 0) {
    return [
      {
        text: 'Example link text',
        color: '#3b82f6',
        textDecoration: 'underline',
        fontSize: '14px',
        fontWeight: '500'
      }
    ];
  }
  
  return linkStyles;
};
