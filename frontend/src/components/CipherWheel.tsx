/**
 * CipherWheel Component
 * Displays an animated cipher wheel with two concentric circles:
 * - Outer ring: Gaileen cipher symbols (stationary)
 * - Inner ring: Alphabet A-Z with shift indicator (rotating)
 */

import React, { useEffect, useState, useRef } from 'react';
import './CipherWheel.css';

interface CipherWheelProps {
  isAnimating: boolean;
  animationSequence?: number[];  // Array of shift positions to animate through
  animationSpeed?: number;        // Speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
  onAnimationComplete?: () => void;
}

// Gaileen cipher symbols (26 total)
const CIPHER_SYMBOLS = [
  ">", "<", "^", "v", ">>", "<<", ".", ".>", "<.", "^.", 
  ".v", "..", "O", "Ø", "X", "/", "\\", "\\\\", "//", "/.", 
  "\\.", "./", ".\\", ":", "+", "="
];

// Alphabet A-Z
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SEGMENTS = 26;
const ANGLE_PER_SEGMENT = 360 / SEGMENTS;
const IDLE_ROTATION_DURATION = 60; // seconds for one full rotation when idle

export function CipherWheel({
  isAnimating,
  animationSequence = [],
  animationSpeed = 1,
  onAnimationComplete
}: CipherWheelProps): React.ReactElement {
  const [rotation, setRotation] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Idle rotation animation
  useEffect(() => {
    if (!isAnimating && animationSequence.length === 0) {
      const startTime = Date.now();
      const startRotation = rotation;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000; // seconds
        const rotationSpeed = 360 / IDLE_ROTATION_DURATION; // degrees per second
        const newRotation = (startRotation + elapsed * rotationSpeed) % 360;
        setRotation(newRotation);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isAnimating, animationSequence.length]);

  // Character-by-character animation
  useEffect(() => {
    if (isAnimating && animationSequence.length > 0) {
      if (currentStep < animationSequence.length) {
        const targetShift = animationSequence[currentStep];
        // Negative rotation to go clockwise (shift 1 = -13.846 degrees)
        const targetRotation = -targetShift * ANGLE_PER_SEGMENT;
        
        // Smooth rotation to target
        setRotation(targetRotation);

        // Pause at each position based on speed
        const pauseDuration = (500 / animationSpeed); // milliseconds
        timeoutRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, pauseDuration);
      } else {
        // Animation complete
        setCurrentStep(0);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating, animationSequence, currentStep, animationSpeed, onAnimationComplete]);

  // Reset animation when starting new sequence
  useEffect(() => {
    if (isAnimating && animationSequence.length > 0) {
      setCurrentStep(0);
    }
  }, [isAnimating, animationSequence]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const transitionDuration = prefersReducedMotion ? '0s' : `${0.3 / animationSpeed}s`;

  return (
    <div className="cipher-wheel-container" role="img" aria-label="Cipher wheel animation">
      <svg
        className="cipher-wheel"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle background */}
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="var(--wheel-outer-bg)"
          stroke="var(--wheel-border)"
          strokeWidth="2"
        />

        {/* Outer ring segments (Gaileen symbols) - Stationary */}
        <g className="outer-ring">
          {CIPHER_SYMBOLS.map((symbol, index) => {
            // Position text in center of segment
            const textAngle = index * ANGLE_PER_SEGMENT - 90;
            const radius = 160;
            const x = 200 + radius * Math.cos((textAngle * Math.PI) / 180);
            const y = 200 + radius * Math.sin((textAngle * Math.PI) / 180);

            // Draw divider line BEFORE this segment (between segments)
            const lineAngle = textAngle - ANGLE_PER_SEGMENT / 2;
            const lineStartRadius = 130;
            const lineEndRadius = 190;
            const lineX1 = 200 + lineStartRadius * Math.cos((lineAngle * Math.PI) / 180);
            const lineY1 = 200 + lineStartRadius * Math.sin((lineAngle * Math.PI) / 180);
            const lineX2 = 200 + lineEndRadius * Math.cos((lineAngle * Math.PI) / 180);
            const lineY2 = 200 + lineEndRadius * Math.sin((lineAngle * Math.PI) / 180);

            return (
              <g key={`outer-${index}`}>
                {/* Segment divider - positioned between segments */}
                <line
                  x1={lineX1}
                  y1={lineY1}
                  x2={lineX2}
                  y2={lineY2}
                  stroke="var(--wheel-border)"
                  strokeWidth="1"
                />
                {/* Symbol text - centered in segment */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="wheel-symbol"
                  transform={`rotate(${textAngle + 90}, ${x}, ${y})`}
                >
                  {symbol}
                </text>
              </g>
            );
          })}
        </g>

        {/* Inner circle background */}
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="var(--wheel-inner-bg)"
          stroke="var(--wheel-border)"
          strokeWidth="2"
        />

        {/* Inner ring (Alphabet) - Rotating */}
        <g
          className="inner-ring"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '200px 200px',
            transition: isAnimating ? `transform ${transitionDuration} ease-in-out` : 'none'
          }}
        >
          {ALPHABET.map((letter, index) => {
            // Position text in center of segment
            const textAngle = index * ANGLE_PER_SEGMENT - 90;
            const radius = 90;
            const x = 200 + radius * Math.cos((textAngle * Math.PI) / 180);
            const y = 200 + radius * Math.sin((textAngle * Math.PI) / 180);

            // Draw divider line BEFORE this segment (between segments)
            const lineAngle = textAngle - ANGLE_PER_SEGMENT / 2;
            const lineStartRadius = 60;
            const lineEndRadius = 120;
            const lineX1 = 200 + lineStartRadius * Math.cos((lineAngle * Math.PI) / 180);
            const lineY1 = 200 + lineStartRadius * Math.sin((lineAngle * Math.PI) / 180);
            const lineX2 = 200 + lineEndRadius * Math.cos((lineAngle * Math.PI) / 180);
            const lineY2 = 200 + lineEndRadius * Math.sin((lineAngle * Math.PI) / 180);

            return (
              <g key={`inner-${index}`}>
                {/* Segment divider - positioned between segments */}
                <line
                  x1={lineX1}
                  y1={lineY1}
                  x2={lineX2}
                  y2={lineY2}
                  stroke="var(--wheel-border)"
                  strokeWidth="1"
                />
                {/* Letter text - centered in segment */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="wheel-letter"
                  transform={`rotate(${textAngle + 90}, ${x}, ${y})`}
                >
                  {letter}
                </text>
              </g>
            );
          })}

          {/* Shift indicator numbers (0-25) on inner circle */}
          {Array.from({ length: 26 }, (_, i) => i).map((num, index) => {
            // Position numbers in center of segment (aligned with letters)
            const textAngle = index * ANGLE_PER_SEGMENT - 90;
            const radius = 40;
            const x = 200 + radius * Math.cos((textAngle * Math.PI) / 180);
            const y = 200 + radius * Math.sin((textAngle * Math.PI) / 180);

            return (
              <text
                key={`shift-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="wheel-shift-number"
                transform={`rotate(${textAngle + 90}, ${x}, ${y})`}
              >
                {num}
              </text>
            );
          })}
        </g>

        {/* Center circle */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill="var(--wheel-center-bg)"
          stroke="var(--wheel-border)"
          strokeWidth="2"
        />

        {/* Shift indicator window (stationary marker at top) */}
        <g className="shift-indicator">
          <polygon
            points="200,10 190,30 210,30"
            fill="var(--primary-color)"
            stroke="var(--wheel-border)"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Animation status indicator */}
      {isAnimating && (
        <div className="animation-status" aria-live="polite">
          Animating... ({currentStep + 1}/{animationSequence.length})
        </div>
      )}
    </div>
  );
}
