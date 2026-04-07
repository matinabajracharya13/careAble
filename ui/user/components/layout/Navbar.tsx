'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Award, BookOpen, LayoutDashboard, LogOut, Menu, Moon, Sun, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CAREER_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assessment', label: 'Assessments', icon: BookOpen },
  { href: '/certificate', label: 'Certificates', icon: Award },
  { href: '/profile', label: 'Profile', icon: User }
];

const EMPLOYER_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employer', label: 'Talent Pool', icon: Users },
  { href: '/assessment', label: 'Assessments', icon: BookOpen }
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const navLinks = user?.role === 'employer' ? EMPLOYER_NAV : CAREER_NAV;
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || isAuthenticated ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className='flex items-center gap-2.5 group'
          >
            <div className='h-8 w-8 flex items-center justify-center shadow-sm overflow-hidden'>
              <Image
                src='/logo.png'
                alt='Logo'
                width={32}
                height={32}
              />
            </div>{' '}
            <span className='font-display font-semibold text-lg tracking-tight hidden sm:block'>
              Care<span className='text-primary'>Able</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className='hidden md:flex items-center gap-1'>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className='flex items-center gap-2'>
            {/* Theme picker */}
            <div className='relative'>
              <button
                onClick={() => setDark(!dark)}
                className='w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary text-sm transition-colors'
              >
                {dark ? <Sun className='h-3.5 w-3.5' /> : <Moon className='h-3.5 w-3.5' />}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                {/* Desktop: avatar chip → profile */}
                <div className='hidden md:flex items-center gap-2'>
                  <Link
                    href='/profile'
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors',
                      isActive('/profile') && 'ring-2 ring-primary/40'
                    )}
                  >
                    <div className='h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground'>
                      {user?.name[0]}
                    </div>
                    <span className='text-sm font-medium max-w-[100px] truncate'>{user?.name}</span>
                    <span className='text-[10px] text-muted-foreground uppercase bg-background rounded px-1 py-0.5'>{user?.role}</span>
                  </Link>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={handleLogout}
                    className='text-muted-foreground hover:text-destructive'
                    title='Sign out'
                  >
                    <LogOut className='h-4 w-4' />
                  </Button>
                </div>

                {/* Mobile hamburger */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden'
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                </Button>
              </>
            ) : (
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  asChild
                >
                  <Link href='/login'>Login</Link>
                </Button>
                <Button
                  size='sm'
                  asChild
                >
                  <Link href='/signup'>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isAuthenticated && (
        <div className='md:hidden bg-background border-t border-border animate-fade-in'>
          <div className='container mx-auto px-4 py-4 space-y-1'>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                <Icon className='h-4 w-4' />
                {label}
              </Link>
            ))}
            <div className='border-t border-border pt-3 mt-3 flex items-center justify-between'>
              <Link
                href='/profile'
                onClick={() => setMobileOpen(false)}
                className='flex items-center gap-2'
              >
                <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm'>
                  {user?.name[0]}
                </div>
                <div>
                  <p className='text-sm font-medium'>{user?.name}</p>
                  <p className='text-xs text-muted-foreground capitalize'>{user?.role}</p>
                </div>
              </Link>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='text-destructive'
              >
                <LogOut className='h-4 w-4 mr-1' />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
