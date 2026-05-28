import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CategorySidebar({ categories, activeCategoryId, onSelect }: any) {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold'>Categories</h2>
        <Button
          size='sm'
          variant='outline'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {categories.map((cat: any) => (
        <div
          key={cat.category_id}
          onClick={() => onSelect(cat.category_id)}
          className={`p-2 rounded-md cursor-pointer border ${activeCategoryId === cat.category_id ? 'bg-muted' : ''}`}
        >
          <p className='font-medium'>{cat.title}</p>
          <p className='text-xs text-muted-foreground'>{cat.description}</p>
        </div>
      ))}
    </div>
  );
}
