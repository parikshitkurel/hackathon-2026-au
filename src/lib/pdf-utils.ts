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
            // Replace oklch, lab, color-mix, and display-p3 colors with a safe fallback
            styleTags[i].innerHTML = styleTags[i].innerHTML
              .replace(/oklch\([^)]+\)/g, "#C10016")
              .replace(/lab\([^)]+\)/g, "#C10016")
              .replace(/color-mix\([^)]+\)/g, "#C10016")
              .replace(/color\(display-p3[^)]+\)/g, "#C10016");
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
              const css = el.style.cssText;
              if (css.includes("oklch") || css.includes("lab") || css.includes("color-mix") || css.includes("display-p3")) {
                el.style.cssText = css
                  .replace(/oklch\([^)]+\)/g, "#C10016")
                  .replace(/lab\([^)]+\)/g, "#C10016")
                  .replace(/color-mix\([^)]+\)/g, "#C10016")
                  .replace(/color\(display-p3[^)]+\)/g, "#C10016");
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
