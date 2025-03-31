document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('textInput');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const previewBtn = document.getElementById('previewBtn');
    const renderTarget = document.getElementById('renderTarget');
    const previewContainer = document.getElementById('previewContainer');
    
    // Constants for page size calculation (A4 size in pixels at 96 DPI)
    const PAGE_WIDTH_PX = 793; // 21cm at 96 DPI
    const PAGE_HEIGHT_PX = 1122; // 29.7cm at 96 DPI
    // Reserve some space for margins and to be safe
    const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - 80;
    
    // Preview button click handler
    previewBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }
        
        console.log("Generating preview...");
        
        // Clear previous preview
        previewContainer.innerHTML = '<h2>Preview with Page Breaks</h2>';
        
        // Split text into pages and generate preview
        const pages = splitTextIntoPages(text);
        
        // Show the preview container
        previewContainer.style.display = 'block';
        
        // Create a preview for each page
        pages.forEach((pageContent, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'preview-page';
            
            // Replace newlines with <br> for proper HTML display
            pageDiv.innerHTML = pageContent.replace(/\n/g, '<br>');
            
            // Add page number indicator
            const pageIndicator = document.createElement('div');
            pageIndicator.className = 'page-indicator';
            pageIndicator.textContent = `Page 1 of 6`;
            pageIndicator.style.fontFamily = 'Arial, sans-serif'; // Normal font
            pageDiv.appendChild(pageIndicator);
            
            previewContainer.appendChild(pageDiv);
        });
        
        // Scroll to the preview
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Function to split text into pages intelligently
    function splitTextIntoPages(text) {
        // Clear and prepare the render target for measurement
        renderTarget.innerHTML = '';
        renderTarget.style.position = 'static';
        renderTarget.style.visibility = 'hidden';
        renderTarget.style.width = PAGE_WIDTH_PX + 'px';
        renderTarget.style.fontFamily = "'Gloria Hallelujah', cursive";
        renderTarget.style.fontSize = '16px';
        renderTarget.style.lineHeight = '1.85';
        renderTarget.style.whiteSpace = 'pre-wrap';
        renderTarget.style.padding = '8px';
        
        // Split by paragraphs first (respecting user's paragraph breaks)
        const paragraphs = text.split(/\n\s*\n/);
        const pages = [];
        let currentPage = '';
        let currentHeight = 0;
        
        // Process each paragraph
        paragraphs.forEach(paragraph => {
            // Test if adding this paragraph exceeds page height
            renderTarget.innerHTML = currentPage + (currentPage ? '\n\n' : '') + paragraph;
            const newHeight = renderTarget.offsetHeight;
            
            if (currentPage && newHeight > CONTENT_HEIGHT_PX) {
                // This paragraph would exceed page height, start a new page
                pages.push(currentPage);
                currentPage = paragraph;
                // Measure the new paragraph alone
                renderTarget.innerHTML = paragraph;
                currentHeight = renderTarget.offsetHeight;
            } else {
                // Add paragraph to current page
                currentPage = currentPage + (currentPage ? '\n\n' : '') + paragraph;
                currentHeight = newHeight;
            }
            
            // Check if this single paragraph is too long for one page
            if (currentHeight > CONTENT_HEIGHT_PX) {
                // Need to split this paragraph across pages
                const words = paragraph.split(/\s+/);
                let testPage = '';
                renderTarget.innerHTML = '';
                
                words.forEach(word => {
                    const testWithWord = testPage + (testPage ? ' ' : '') + word;
                    renderTarget.innerHTML = testWithWord;
                    
                    if (renderTarget.offsetHeight > CONTENT_HEIGHT_PX) {
                        // Adding this word exceeds page height
                        pages.push(testPage);
                        testPage = word;
                    } else {
                        testPage = testWithWord;
                    }
                });
                
                // Add the remaining part of the paragraph
                if (testPage) {
                    currentPage = testPage;
                    renderTarget.innerHTML = currentPage;
                    currentHeight = renderTarget.offsetHeight;
                }
            }
        });
        
        // Add the last page if not empty
        if (currentPage) {
            pages.push(currentPage);
        }
        
        // Reset render target back to hidden absolute position
        renderTarget.style.position = 'absolute';
        renderTarget.style.left = '-9999px';
        renderTarget.style.visibility = 'visible';
        renderTarget.innerHTML = '';
        
        return pages;
    }
    
    // Generate PDF button click handler
    generatePdfBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }

        console.log("Preparing PDF generation...");
        
        // First generate the pages with the same algorithm used for preview
        const pages = splitTextIntoPages(text);
        
        // Clear the render target
        renderTarget.innerHTML = '';
        renderTarget.style.position = 'static';
        renderTarget.style.left = 'auto';
        renderTarget.style.width = '21cm';
        renderTarget.style.border = '1px solid white';
        renderTarget.style.margin = '20px auto';
        renderTarget.style.fontFamily = "'Gloria Hallelujah', cursive";
        renderTarget.style.fontSize = '16px';
        renderTarget.style.lineHeight = '1.85';
        renderTarget.style.whiteSpace = 'pre-wrap';
        renderTarget.style.padding = '8px';
        renderTarget.style.backgroundColor = 'white';
        
        // PDF generation settings
        const opt = {
            margin: 10,
            filename: 'handwritten-output.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,  // Better resolution
                useCORS: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        };
        
        // Create a document with the correctly paginated content
        let allPagesHTML = '';
        
        pages.forEach((pageContent, index) => {
            // Add a div for each page, with page break after (except the last page)
            const pageBreakClass = index < pages.length - 1 ? 'html2pdf__page-break' : '';
            allPagesHTML += `<div class="${pageBreakClass}" style="width: 100%;">${pageContent.replace(/\n/g, '<br>')}</div>`;
        });
        
        renderTarget.innerHTML = allPagesHTML;
        
        console.log("Starting PDF generation with", pages.length, "pages...");
        
        // Use html2pdf to generate the PDF
        html2pdf().from(renderTarget).set(opt).save()
            .then(() => {
                console.log("PDF generated successfully!");
                // Hide the render target again
                renderTarget.style.position = 'absolute';
                renderTarget.style.left = '-9999px';
                // Clear the render target after use
                renderTarget.innerHTML = '';
            })
            .catch(error => {
                console.error("Error during PDF generation:", error);
                alert("An error occurred while generating the PDF. Please check the console for details.");
                // Hide the render target again
                renderTarget.style.position = 'absolute';
                renderTarget.style.left = '-9999px';
                // Clear the render target after use
                renderTarget.innerHTML = '';
            });
    });
});