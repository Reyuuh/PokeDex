import React from 'react';
import '../styles/PixelBg.scss';

const PIXELS = [
  { size: 8,  left: '5%',  duration: 38, delay: 0,  color: '#ffffff', drift: '-15px' },
  { size: 12, left: '12%', duration: 45, delay: 4,  color: '#7dd8f0', drift: '20px'  },
  { size: 6,  left: '20%', duration: 28, delay: 1,  color: '#ffffff', drift: '-10px' },
  { size: 10, left: '30%', duration: 50, delay: 7,  color: '#5bc0eb', drift: '25px'  },
  { size: 8,  left: '40%', duration: 33, delay: 2,  color: '#ffffff', drift: '-20px' },
  { size: 14, left: '50%', duration: 44, delay: 9,  color: '#4fb8e0', drift: '15px'  },
  { size: 6,  left: '60%', duration: 30, delay: 0,  color: '#ffffff', drift: '-25px' },
  { size: 10, left: '68%', duration: 42, delay: 5,  color: '#a0d8f0', drift: '10px'  },
  { size: 8,  left: '76%', duration: 36, delay: 3,  color: '#ffffff', drift: '-15px' },
  { size: 12, left: '84%', duration: 48, delay: 11, color: '#7dd8f0', drift: '20px'  },
  { size: 6,  left: '91%', duration: 26, delay: 6,  color: '#ffffff', drift: '-10px' },
  { size: 10, left: '96%', duration: 40, delay: 1,  color: '#5bc0eb', drift: '15px'  },
  { size: 6,  left: '8%',  duration: 52, delay: 13, color: '#a0d8f0', drift: '10px'  },
  { size: 8,  left: '16%', duration: 35, delay: 8,  color: '#ffffff', drift: '-20px' },
  { size: 10, left: '25%', duration: 46, delay: 15, color: '#5bc0eb', drift: '15px'  },
  { size: 6,  left: '35%', duration: 29, delay: 3,  color: '#ffffff', drift: '-10px' },
  { size: 12, left: '45%', duration: 55, delay: 10, color: '#7dd8f0', drift: '25px'  },
  { size: 8,  left: '55%', duration: 38, delay: 0,  color: '#ffffff', drift: '-15px' },
  { size: 6,  left: '64%', duration: 31, delay: 17, color: '#4fb8e0', drift: '20px'  },
  { size: 10, left: '72%', duration: 43, delay: 5,  color: '#ffffff', drift: '-25px' },
  { size: 8,  left: '80%', duration: 49, delay: 12, color: '#a0d8f0', drift: '10px'  },
  { size: 6,  left: '88%', duration: 27, delay: 2,  color: '#ffffff', drift: '-10px' },
  { size: 12, left: '94%', duration: 41, delay: 8,  color: '#5bc0eb', drift: '20px'  },
];

export const PixelBg: React.FC = () => (
  <div className="pixel-bg" aria-hidden="true">
    {PIXELS.map((p, i) => (
      <div
        key={i}
        className="pixel"
        style={{
          width:  p.size,
          height: p.size,
          top:    0,
          left:   p.left,
          backgroundColor: p.color,
          animationName:           'pixel-fall',
          animationDuration:       `${p.duration}s`,
          animationDelay:          `${p.delay}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          '--drift-x':    p.drift,
          '--glow-color': p.color,
        } as React.CSSProperties}
      />
    ))}
  </div>
);
