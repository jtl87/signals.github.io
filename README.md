# Meridian Signals Website

A sophisticated, minimalist single-page website for an institutional-grade cryptocurrency trading signals service.

## Features

- **Responsive Design**: Mobile-first approach, works seamlessly across all devices
- **Dark Theme**: Professional aesthetic with refined gold accents
- **Fast Loading**: Minimal dependencies (only Google Fonts external)
- **Accessible**: Semantic HTML, proper contrast ratios, keyboard navigation
- **GitHub Pages Ready**: Static HTML/CSS/JS, no build step required

## File Structure

```
trading-signals-site/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Minimal interactivity
├── assets/
│   └── favicon.svg     # Site favicon
└── README.md           # This file
```

## Deployment to GitHub Pages

### Option 1: Deploy from main branch

1. Push this repository to GitHub
2. Go to repository **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be live at `https://[username].github.io/[repo-name]/`

### Option 2: Using GitHub Actions (recommended for automation)

1. Push to GitHub
2. Go to **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. The site will auto-deploy on each push

## Local Development

No build tools required. Simply open `index.html` in a browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Or just open index.html directly in your browser
```

## Customization

### Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --color-bg: #0a0b0d;
    --color-accent: #c9a962;
    /* ... */
}
```

### Content
All content is in `index.html`. Key sections:
- Hero: Lines 50-90
- Methodology: Lines 100-170
- Risk Management: Lines 180-230
- Validation: Lines 240-290
- Approach (Beginner/Advanced tabs): Lines 300-450
- FAQ: Lines 460-490
- Contact: Lines 500-520

### Contact Email
Update the email address in the contact section:

```html
<a href="mailto:your-email@domain.com" class="contact-btn">
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

All rights reserved.
