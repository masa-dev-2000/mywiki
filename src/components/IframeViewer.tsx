'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  baseWidth?: number;
}

export default function IframeViewer({ src, baseWidth = 960 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setScale(Math.min(w / baseWidth, 1));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [baseWidth]);

  return (
    <div ref={containerRef} className="iframe-container">
      <div
        className="iframe-scaler"
        style={{
          width: baseWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          height: baseWidth * 0.5625, // 16:9
        }}
      >
        <iframe
          src={src}
          title="コンテンツ"
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
}
