export function Progress({ value = 0 }: { value?: number }) {
  return (
    <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
      <div
        className='h-full bg-primary transition-all'
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
