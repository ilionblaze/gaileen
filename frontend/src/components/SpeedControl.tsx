/**
 * SpeedControl Component
 * Slider to control the animation speed of the cipher wheel
 */

import React from 'react';
import './SpeedControl.css';

interface SpeedControlProps {
  speed: number;
  onChange: (speed: number) => void;
  disabled?: boolean;
}

export function SpeedControl({
  speed,
  onChange,
  disabled = false
}: SpeedControlProps): React.ReactElement {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const getSpeedLabel = (speed: number): string => {
    if (speed <= 0.5) return 'Slow';
    if (speed <= 1) return 'Normal';
    if (speed <= 2) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="speed-control">
      <label htmlFor="speed-slider" className="speed-control-label">
        Animation Speed: <strong>{getSpeedLabel(speed)}</strong>
      </label>
      <div className="speed-control-slider-container">
        <span className="speed-control-min">0.5x</span>
        <input
          id="speed-slider"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={speed}
          onChange={handleChange}
          disabled={disabled}
          className="speed-control-slider"
          aria-label="Animation speed control"
          aria-valuemin={0.5}
          aria-valuemax={3}
          aria-valuenow={speed}
          aria-valuetext={`${speed}x speed - ${getSpeedLabel(speed)}`}
        />
        <span className="speed-control-max">3x</span>
      </div>
      <div className="speed-control-value">{speed.toFixed(1)}x</div>
    </div>
  );
}
