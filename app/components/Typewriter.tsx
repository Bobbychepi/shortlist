import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorClassName?: string;
  className?: string;
  onComplete?: () => void;
  deleteSpeed?: number;
  pauseDuration?: number;
}


export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  cursor = true,
  cursorClassName = "bg-blue-500",
  className = "",
  onComplete,
  deleteSpeed = 30,
  pauseDuration = 1500,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const texts = Array.isArray(text) ? text : [text];
  const currentFullText = texts[textIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing phase
        if (currentIndex < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, currentIndex + 1));
          setCurrentIndex((prev) => prev + 1);
          timeout = setTimeout(handleTyping, speed);
        } else {
          // Finished typing one segment
          if (onComplete && !loop) onComplete();
          
          if (loop || texts.length > 1) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        }
      } else {
        // Deleting phase
        if (currentIndex > 0) {
          setDisplayText(currentFullText.slice(0, currentIndex - 1));
          setCurrentIndex((prev) => prev - 1);
          timeout = setTimeout(handleTyping, deleteSpeed);
        } else {
          // Finished deleting
          setIsDeleting(false);
          const nextTextIndex = (textIndex + 1) % texts.length;
          
          if (!loop && nextTextIndex === 0) {
            // Stop if loop is false and we reached the end of the array
            return;
          }
          
          setTextIndex(nextTextIndex);
        }
      }
    };

    timeout = setTimeout(handleTyping, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, isStarted, currentFullText, texts.length, loop, speed, deleteSpeed, pauseDuration, onComplete]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      {cursor && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`ml-1 inline-block w-[2px] h-[1.2em] self-center ${cursorClassName}`}
        />
      )}
    </div>
  );
}
