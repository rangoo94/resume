import "./styles/print/print.scss";

// Mask
{
  const MASKING_CHARACTER = "•";
  const mask = (str: string): string => str.replace(/\S/g, MASKING_CHARACTER);
  const maskContent = (element: HTMLElement) => {
    element.textContent = mask(element.textContent!);
  };
  const maskAttribute = (element: HTMLElement) => {
    const attribute = element.getAttribute("data-masked-attr");
    if (attribute === "href") {
      element.removeAttribute(attribute);
    } else if (attribute) {
      element.setAttribute(
        attribute!,
        mask(element.getAttribute(attribute) || ""),
      );
    }
  };
  const get = (selector: string) =>
    Array.from<HTMLElement>(document.querySelectorAll(selector));
  const deleteElement = (element: HTMLElement) => {
    element.parentNode?.removeChild(element);
  };

  // @ts-expect-error: custom function exposed
  window.maskResume = () => {
    get("[data-masked]").forEach(maskContent);
    get("[data-masked-attr]").forEach(maskAttribute);
  };

  // @ts-expect-error: custom function exposed
  window.deletePhotos = () => {
    get("[data-masked-image]").forEach(deleteElement);
  };
}
