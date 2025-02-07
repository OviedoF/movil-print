import React, { useEffect } from 'react'

function usePreventZoom(scrollCheck = true, keyboardCheck = true) {
  useEffect(() => {
    const handleKeydown = (e) => {
      if (
        keyboardCheck &&
        e.ctrlKey &&
        (e.keyCode == "61" ||
          e.keyCode == "107" ||
          e.keyCode == "173" ||
          e.keyCode == "109" ||
          e.keyCode == "187" ||
          e.keyCode == "189")
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e) => {
      if (scrollCheck && e.ctrlKey) {
        e.preventDefault();
      }
    };

    const autoZoom = () => {
      document.body.style.zoom = "100%";
    }
    const preventZoom = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener('resize', autoZoom);
    document.addEventListener("touchmove", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener('resize', autoZoom);
      document.removeEventListener("touchmove", preventZoom);
    };
  }, [scrollCheck, keyboardCheck]);

  return null;
}

export default usePreventZoom