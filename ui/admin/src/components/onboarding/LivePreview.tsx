export function LivePreview({ questions }: any) {
  return (
    <div className='space-y-4'>
      <h2 className='font-semibold'>Live Preview</h2>

      <div className='border rounded-md p-4 space-y-8 bg-background'>
        {questions.map((q: any, i: number) => (
          <div
            key={q.question_id}
            className='space-y-4'
          >
            {/* Question */}
            <div className='space-y-1'>
              <p className='font-medium text-base leading-relaxed'>
                {i + 1}. {q.question_text}
              </p>

              {q.is_required && <p className='text-xs text-red-500'>* Required</p>}
            </div>

            {/* RADIO */}
            {q.input_type === 'radio' && (
              <div className='space-y-2'>
                {q.options?.map((option: any) => (
                  <label
                    key={option.option_id}
                    className='flex items-center gap-3 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/40 transition'
                  >
                    <div className='h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center'>
                      <div className='h-2 w-2 rounded-full bg-primary opacity-0' />
                    </div>

                    <span className='text-sm'>{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* SELECT */}
            {q.input_type === 'select' && (
              <select className='w-full border rounded-md px-3 py-2 text-sm bg-background'>
                <option>Select an option</option>

                {q.options?.map((option: any) => (
                  <option key={option.option_id}>{option.option_text}</option>
                ))}
              </select>
            )}

            {/* MULTISELECT */}
            {q.input_type === 'multiselect' && (
              <div className='space-y-2'>
                {q.options?.map((option: any) => (
                  <label
                    key={option.option_id}
                    className='flex items-center gap-3 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/40 transition'
                  >
                    <div className='h-4 w-4 rounded-full border' />

                    <span className='text-sm'>{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* BOOLEAN FALLBACK */}
            {q.question_type === 'boolean' && q.input_type !== 'radio' && (
              <div className='space-y-2'>
                <label className='flex items-center gap-3 border rounded-md px-3 py-2'>
                  <div className='h-4 w-4 rounded-full border' />
                  <span className='text-sm'>Yes</span>
                </label>

                <label className='flex items-center gap-3 border rounded-md px-3 py-2'>
                  <div className='h-4 w-4 rounded-full border' />
                  <span className='text-sm'>No</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
