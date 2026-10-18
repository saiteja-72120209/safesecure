import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorLabel, setCursorLabel] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return undefined;

    setIsEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animFrameId = null;
    let lastInteractive = null;
    let lastLabel = null;
    let lastMagnetic = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target;
      const interactiveEl = target?.closest(
        'a, button, [role="button"], [data-cursor], [data-cursor-label], .interactive-target'
      );
      const formControl = target?.closest('input, textarea, select');

      if (formControl && !interactiveEl) {
        if (lastInteractive) {
          lastInteractive = null;
          lastLabel = null;
          setCursorLabel(null);
          dotRef.current?.classList.remove('cursor-hover');
          ringRef.current?.classList.remove('cursor-hover');
        }
        return;
      }

      if (interactiveEl) {
        if (lastInteractive !== interactiveEl) {
          lastInteractive = interactiveEl;
          dotRef.current?.classList.add('cursor-hover');
          ringRef.current?.classList.add('cursor-hover');
          const label = interactiveEl.getAttribute('data-cursor-label');
          if (label !== lastLabel) {
            lastLabel = label;
            setCursorLabel(label || null);
          }
        }

        if (interactiveEl.hasAttribute('data-magnetic')) {
          lastMagnetic = interactiveEl;
          const rect = interactiveEl.getBoundingClientRect();
          const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
          const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
          interactiveEl.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
        }
      } else if (lastInteractive) {
        lastInteractive = null;
        lastLabel = null;
        setCursorLabel(null);
        dotRef.current?.classList.remove('cursor-hover');
        ringRef.current?.classList.remove('cursor-hover');
        if (lastMagnetic) {
          lastMagnetic.style.transform = 'translate3d(0, 0, 0)';
          lastMagnetic = null;
        }
      }
    };

    const renderLoop = () => {
      const ease = 0.16;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="cursor-wrapper" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        {cursorLabel && <div className="cursor-badge">{cursorLabel}</div>}
      </div>
    </div>
  );
}
