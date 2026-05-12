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
        // Find ALL style tags and replace modern color functions globally
        const styleTags = clonedDoc.getElementsByTagName("style");
        for (let i = 0; i < styleTags.length; i++) {
          try {
            styleTags[i].innerHTML = styleTags[i].innerHTML
              .replace(/lab\([^)]+\)/g, "#C10016")
              .replace(/oklch\([^)]+\)/g, "#C10016");
          } catch (e) {
            console.warn("Could not sanitize style tag:", e);
          }
        }
        
        // Sanitize inline styles
        const elements = clonedDoc.getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          if (el.style) {
            try {
              const cssText = el.style.cssText;
              if (cssText && (cssText.includes("lab(") || cssText.includes("oklch("))) {
                el.style.cssText = cssText
                  .replace(/lab\([^)]+\)/g, "#C10016")
                  .replace(/oklch\([^)]+\)/g, "#C10016");
              }
            } catch (e) {
              // Ignore elements where style.cssText might be read-only or error
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
