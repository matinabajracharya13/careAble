'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { useMessages } from '@/hooks/use-message';
import { formatDate } from '@/lib/utils';
import type { Message } from '@/types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

export function MessagesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useMessages({ search, limit: 20 });

  const messages = data?.data || [];

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reply, setReply] = useState('');

  // Fake replies for now (replace with API later)
  const [threads, setThreads] = useState<Record<number, Message[]>>({});

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setDrawerOpen(true);
    setReply('');
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    const newReply: Message = {
      id: Date.now(),
      full_name: 'Admin',
      email: 'admin@system.com',
      subject: 'reply',
      body: reply,
      created_at: new Date().toISOString()
    };

    setThreads((prev) => ({
      ...prev,
      [selectedMessage.id]: [...(prev[selectedMessage.id] || []), newReply]
    }));

    setReply('');

    // TODO: replace with API call
    // await api.post('/messages/reply', { parent_id: selectedMessage.id, body: reply });

    refetch?.();
  };

  const replies = selectedMessage ? threads[selectedMessage.id] || [] : [];

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold font-display tracking-tight'>Messages</h1>
          <p className='text-muted-foreground text-sm mt-1'>Manage your messages and communications.</p>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search messages...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            <Badge
              variant='secondary'
              className='text-xs'
            >
              {messages.length} messages
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/30'>
                  <th className='text-left px-6 py-3'>Name</th>
                  <th className='text-left px-4 py-3'>Subject</th>
                  <th className='text-left px-4 py-3'>Date</th>
                </tr>
              </thead>

              <tbody className='divide-y'>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 3 }).map((_, j) => (
                          <td
                            key={j}
                            className='px-6 py-4'
                          >
                            <Skeleton className='h-4 w-full max-w-[120px]' />
                          </td>
                        ))}
                      </tr>
                    ))
                  : messages.map((message: Message) => (
                      <tr
                        key={message.id}
                        className='hover:bg-muted/30 cursor-pointer'
                        onClick={() => openMessage(message)}
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-8 w-8'>
                              <AvatarFallback>
                                {message.full_name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className='font-medium'>{message.full_name}</p>
                              <p className='text-xs text-muted-foreground'>{message.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className='px-4 py-4'>{message.subject}</td>

                        <td className='px-4 py-4 text-muted-foreground'>{formatDate(message.created_at)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!isLoading && messages.length === 0 && <div className='text-center py-12 text-muted-foreground'>No messages found</div>}
          </div>
        </CardContent>
      </Card>

      {/* ================= DRAWER ================= */}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        <DrawerContent className='w-full sm:max-w-xl ml-auto'>
          <DrawerHeader>
            <DrawerTitle>{selectedMessage?.subject}</DrawerTitle>
          </DrawerHeader>

          {selectedMessage && (
            <div className='p-4 space-y-4'>
              {/* Message Info */}
              <div className='border-b pb-3'>
                <p className='font-medium'>{selectedMessage.full_name}</p>
                <p className='text-sm text-muted-foreground'>{selectedMessage.email}</p>
              </div>

              {/* Message Body */}
              <div className='text-sm whitespace-pre-wrap'>{selectedMessage.message}</div>

              {/* Replies */}
              <div className='space-y-3'>
                <p className='text-xs text-muted-foreground'>Replies</p>

                {replies.map((r) => (
                  <div
                    key={r.id}
                    className='border rounded-lg p-3 bg-muted/30'
                  >
                    <p className='text-xs text-muted-foreground'>{formatDate(r.created_at)}</p>
                    <p className='text-sm mt-1'>{r.body}</p>
                  </div>
                ))}

                {replies.length === 0 && <p className='text-xs text-muted-foreground'>No replies yet</p>}
              </div>

              {/* Reply Box */}
              <div className='border-t pt-4 space-y-2'>
                <textarea
                  className='w-full border rounded-md p-2 text-sm'
                  rows={3}
                  placeholder='Write a reply...'
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <Button
                  onClick={handleSendReply}
                  className='w-full'
                >
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
