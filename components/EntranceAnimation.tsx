
import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface EntranceAnimationProps {
  onComplete: () => void;
}

const EntranceAnimation: React.FC<EntranceAnimationProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-300">
      <div className="flex flex-col items-center">
        <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-4 rounded-xl mb-4">
          <Terminal size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">STAR MC</h1>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">舵星归途</p>
      </div>
    </div>
  );
};

export default EntranceAnimation;
