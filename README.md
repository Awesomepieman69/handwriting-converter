# Handwriting Converter

A simple web application that converts typed text to handwritten style and generates PDFs.

## Features

- Convert typed text to a handwritten style using the 'Gloria Hallelujah' font
- Preview text with automatic page breaks before generating PDF
- Generate downloadable PDFs with correctly paginated content
- Intelligent page breaking that respects paragraph structure

## How to Use

1. Type or paste your text in the input box
2. Click "Preview" to see how your text will be divided into pages
3. Click "Generate PDF" to create and download a PDF of your handwritten text

## Technologies Used

- HTML/CSS
- JavaScript
- html2canvas - For capturing the rendered text as images
- html2pdf.js - For creating the PDF document

## Installation

No installation required. Simply open the `index.html` file in a web browser.

## Font Requirements

This project uses the 'Gloria Hallelujah' font. You need to:

1. Download the font from [Google Fonts](https://fonts.google.com/specimen/Gloria+Hallelujah)
2. Create a folder named 'Gloria_Hallelujah' in the root directory
3. Place the 'GloriaHallelujah-Regular.ttf' file in that folder

Alternatively, you can remove the @font-face declaration and use the Google Fonts CDN by adding this line to the `<head>` section:
```html
<link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap" rel="stylesheet">
```

## Live Demo

You can use the application directly through GitHub Pages at: https://awesomepieman69.github.io/handwriting-converter/

## License

MIT License