// components/ui/textarea.tsx

import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full min-h-[100px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${props.className ?? ''}`}
    />
  );
});

Textarea.displayName = 'Textarea';
