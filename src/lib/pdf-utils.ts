import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (element: HTMLElement, filename: string) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Remove ALL link tags to prevent html2canvas from trying to fetch/parse external CSS with modern functions
        const linkTags = clonedDoc.getElementsByTagName("link");
        for (let i = linkTags.length - 1; i >= 0; i--) {
          if (linkTags[i].rel === "stylesheet") {
            linkTags[i].parentNode?.removeChild(linkTags[i]);
          }
        }

        // Find ALL style tags and aggressively sanitize them
        const styleTags = clonedDoc.getElementsByTagName("style");
        for (let i = 0; i < styleTags.length; i++) {
          try {
            // Completely remove any CSS lines containing modern color functions
            // This prevents the parser from even seeing the unsupported syntax
            styleTags[i].innerHTML = styleTags[i].innerHTML
              .replace(/[a-z-]+\s*:\s*[^;]*?(oklch|lab|color-mix|display-p3)[^;]*?;/gi, "/* fallback */ color: #C10016; ")
              .replace(/@media\s+[^\{]+\{[^\}]+(oklch|lab|color-mix)[^\}]+\}/gi, "/* removed media query */");
          } catch (e) {
            console.warn("Could not sanitize style tag:", e);
          }
        }
        
        // Sanitize inline styles for ALL elements in the clone
        const allElements = clonedDoc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          if (el.style && el.style.cssText) {
            try {
              const css = el.style.cssText.toLowerCase();
              if (css.includes("oklch") || css.includes("lab") || css.includes("color-mix") || css.includes("display-p3")) {
                // Clear problematic inline styles
                el.style.color = "#000000";
                el.style.backgroundColor = "transparent";
              }
              // Force word spacing for better PDF readability
              if (el.tagName === "P" || el.tagName === "DIV") {
                el.style.wordSpacing = "normal";
                el.style.letterSpacing = "normal";
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      }
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2], // Divide by scale
    });
    
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
