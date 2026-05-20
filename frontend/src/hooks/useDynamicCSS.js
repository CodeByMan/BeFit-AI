// frontend/src/hooks/useDynamicCSS.js
import { useEffect } from "react";

export default function useDynamicCSS(href) {
  useEffect(() => {
    // 1. Check if CSS already exists (prevent duplicates)
    let existing = document.querySelector(`link[data-dynamic="${href}"]`);
    if (existing) {
      existing.disabled = false;
      return () => {
        existing.disabled = true;
      };
    }

    // 2. Create link tag
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.dynamic = href;
    link.disabled = false;

    // 3. Append instantly (CSS usually loads from preload cache)
    document.head.appendChild(link);

    return () => {
      // keep file but disable instead of removing it
      // this allows instant re-enable on navigation
      link.disabled = true;
    };
  }, [href]);
}
