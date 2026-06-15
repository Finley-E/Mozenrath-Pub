import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface DialogBoxProps {
  text: string;
  onComplete?: () => void;
  speaker?: string;
  showContinueIndicator?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  text,
  onComplete,
  speaker,
  showContinueIndicator = true,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText === text) {
      setIsComplete(true);
      if (autoClose) {
        const timer = setTimeout(() => {
          onComplete?.();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [displayedText, text, autoClose, autoCloseDelay, onComplete]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#161e17] border-t-4 border-[#4c6c4c] p-6 shadow-2xl z-50 max-w-2xl mx-auto">
      {speaker && (
        <p className="text-[#4c6c4c] font-bold text-sm uppercase mb-2 tracking-wider">
          {speaker}
        </p>
      )}
      <p className="text-[#eff6ee] text-base leading-relaxed font-sans min-h-[60px]">
        {displayedText}
      </p>
      {isComplete && showContinueIndicator && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onComplete}
            className="animate-bounce p-2 hover:bg-[#2d392e] rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-[#4c6c4c]" />
          </button>
        </div>
      )}
    </div>
  );
};
