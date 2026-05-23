import React, { useEffect, useRef, useState } from 'react';

let bottomWrapperRefGlobal = null;

// 🔥 expose methods like old BottomWrapperMethods
export const BottomWrapperMethods = () => {
  return bottomWrapperRefGlobal || {};
};

const BottomContainerWrapper = ({ children, style = {}, gapfromdown = 10 }) => {
  const wrapperRef = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState('200px');

  // ✅ calculate height (no jQuery)
  const calcWrapperHeight = () => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const height =
      Math.floor(window.innerHeight - rect.top - gapfromdown) + 'px';

    setWrapperHeight(height);
  };

  useEffect(() => {
    // 🔹 expose method globally (same as old)
    bottomWrapperRefGlobal = {
      calcWrapperHeight
    };

    // 🔹 initial calculation
    calcWrapperHeight();

    // 🔹 resize listener
    window.addEventListener('resize', calcWrapperHeight);

    // 🔹 MutationObserver (same logic)
    const upperSectionContainer = document.getElementById(
      'upperSectionContainer'
    );

    let observer;

    if (upperSectionContainer) {
      observer = new MutationObserver(calcWrapperHeight);

      observer.observe(upperSectionContainer, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // 🔹 cleanup
    return () => {
      window.removeEventListener('resize', calcWrapperHeight);

      if (observer) {
        observer.disconnect();
      }

      bottomWrapperRefGlobal = null;
    };
  }, [gapfromdown]);

  return (
    <div
      id="bottomOuterContainerWrapper"
      ref={wrapperRef}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: style.height || wrapperHeight,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default BottomContainerWrapper;