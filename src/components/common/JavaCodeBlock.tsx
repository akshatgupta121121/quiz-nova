import React from 'react';
import { Terminal } from 'lucide-react';

interface JavaCodeBlockProps {
  code: string;
}

export const JavaCodeBlock: React.FC<JavaCodeBlockProps> = ({ code }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 shadow-md font-mono-code text-xs md:text-sm my-3">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-lime-400" />
          <span className="font-medium text-neutral-300">Java</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed text-neutral-200 selection:bg-lime-400 selection:text-neutral-950">
        <code>{code}</code>
      </pre>
    </div>
  );
};
