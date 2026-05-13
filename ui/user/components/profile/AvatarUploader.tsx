// ── Avatar uploader ───────────────────────────────────────────────────────────

import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from '../ui/toast';

export function AvatarUploader({ name, avatar }: { name: string; avatar?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatar ?? null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    toast({ variant: 'success', title: 'Avatar updated!' });
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className='relative group w-fit'>
      <div className='h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-primary/20'>
        {preview ? (
          <img
            src={preview}
            alt={name}
            className='w-full h-full object-cover'
          />
        ) : (
          initials
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className='absolute inset-0 rounded-2xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity'
      >
        <Camera className='h-5 w-5 text-white' />
      </button>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFile}
      />
    </div>
  );
}
