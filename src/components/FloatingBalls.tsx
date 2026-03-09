import React from 'react';
import '../styles/FloatingBalls.scss';

const BALLS = [
  { size: 60,  left: '5%',  duration: 14, delay: 0   },
  { size: 90,  left: '15%', duration: 20, delay: 3   },
  { size: 40,  left: '28%', duration: 11, delay: 7   },
  { size: 110, left: '40%', duration: 25, delay: 1   },
  { size: 55,  left: '55%', duration: 16, delay: 5   },
  { size: 80,  left: '67%', duration: 19, delay: 9   },
  { size: 45,  left: '78%', duration: 13, delay: 2   },
  { size: 100, left: '88%', duration: 22, delay: 6   },
  { size: 65,  left: '96%', duration: 17, delay: 11  },
];

export const FloatingBalls: React.FC = () => (
  <div className="pokeballs-bg" aria-hidden="true">
    {BALLS.map((b, i) => (
      <div
        key={i}
        className="pokeball"
        style={{
          width:  b.size,
          height: b.size,
          left:   b.left,
          animationDuration: `${b.duration}s`,
          animationDelay:    `${b.delay}s`,
        }}
      />
    ))}
  </div>
);
