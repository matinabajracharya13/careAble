'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

export const DrawerPortal = Dialog.Portal;

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out', className)}
    {...props}
  />
));
DrawerOverlay.displayName = 'DrawerOverlay';

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />

    <Dialog.Content
      ref={ref}
      className={cn(
        'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'slide-in-from-right',
        className
      )}
      {...props}
    >
      {children}

      <Dialog.Close className='absolute right-4 top-4 opacity-70 hover:opacity-100'>
        <X className='h-4 w-4' />
      </Dialog.Close>
    </Dialog.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('p-4 border-b', className)}
    {...props}
  />
);

export const DrawerTitle = React.forwardRef<React.ElementRef<typeof Dialog.Title>, React.ComponentPropsWithoutRef<typeof Dialog.Title>>(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
);
DrawerTitle.displayName = 'DrawerTitle';
