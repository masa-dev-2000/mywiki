'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
}

export default function IframeViewer({ src }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'resize' && typeof e.data.height === 'number') {
        setHeight(e.data.height + 32); // padding余白
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="iframe-container">
      <iframe
        ref={iframeRef}
        src={src}
        title="コンテンツ"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: `${height}px`,
          border: 'none',
          borderRadius: '12px',
        }}
      />
    </div>
  );
}
