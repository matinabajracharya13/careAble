'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Badge, Card, CardContent, Separator } from '@/components/ui/ui-components';
import { SITE_CONFIG } from '@/config/site';
import { APP_SHORT_NAME } from '@/constants/app';
import { certificateApi } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Award, CheckCircle, Download, ExternalLink, Loader2, Share2, Shield, Star, StarHalf } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { queryKeys } from '@/lib/query-keys';

// ── Certificate visual ────────────────────────────────────────────────────────
function CertificateCard({ cert, isCapturing = false }: { cert: any; isCapturing?: boolean }) {
  return (
    <div
      className='relative bg-gradient-to-br from-card via-card to-primary/5 border-4 border-primary/20 rounded-2xl p-10 overflow-visible print:rounded-none print:border-2'
      style={isCapturing ? { background: '#ffffff' } : undefined}
    >
      {' '}
      {/* Decorative bg — hide during capture to avoid clipping artifacts */}
      {!isCapturing && (
        <>
          <div className='absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2' />
          <div className='absolute bottom-0 left-0 h-48 w-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2' />
        </>
      )}
      <div
        className='absolute inset-0 opacity-[0.03] rounded-2xl'
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }}
      />
      <div className='relative z-10 text-center space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-center gap-3'>
          <div className='h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20'>
            <span className='text-primary-foreground font-display font-bold text-lg'>{APP_SHORT_NAME}</span>
          </div>
          <div className='text-left'>
            <p className='font-display font-bold text-xl text-foreground'>{SITE_CONFIG.name}</p>
          </div>
        </div>

        <Separator />

        <div className='space-y-2'>
          <p className='text-sm font-semibold text-muted-foreground uppercase tracking-widest'>Certificate of Achievement</p>
          <h1 className='text-2xl font-display font-bold text-foreground'>This certifies that</h1>
        </div>

        {/* Recipient — use solid primary color instead of gradient-text during capture */}
        <div className='space-y-1'>
          <h2
            className={
              isCapturing ? 'text-4xl font-display italic font-bold text-primary' : 'text-4xl font-display italic font-bold gradient-text'
            }
          >
            {cert.full_name}
          </h2>
          <p className='text-sm text-muted-foreground'>has successfully demonstrated proficiency in</p>
        </div>

        {/* Assessment */}
        <div className='bg-primary/5 border border-primary/20 rounded-xl px-8 py-4'>
          <h3 className='text-2xl font-display font-bold text-primary'>{cert.assessment_title}</h3>
          <div className='flex items-center justify-center gap-4 mt-2'>
            <span className='text-xs font-semibold capitalize text-foreground'>Level</span>
            <span className='text-muted-foreground/40'>·</span>
            <span className='text-xs text-success font-semibold'>100% score</span>
          </div>
        </div>

        {/* Stars */}
        <div className='flex justify-center gap-1'>
          {Array.from({ length: 5 }).map((_, i) => {
            const score = cert.overall_mean_score;
            if (score >= i + 1)
              return (
                <Star
                  key={i}
                  className='h-5 w-5 fill-warning text-warning'
                />
              );
            if (score >= i + 0.5)
              return (
                <StarHalf
                  key={i}
                  className='h-5 w-5 fill-warning text-warning'
                />
              );
            return (
              <Star
                key={i}
                className='h-5 w-5 text-muted-foreground/20'
              />
            );
          })}
        </div>

        <Separator />

        {/* Footer meta — FIXED: certificate_code in Verification */}
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div>
            <p className='text-xs text-muted-foreground'>Issued by</p>
            <p className='text-sm font-semibold'>{SITE_CONFIG.title}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Issue date</p>
            <p className='text-sm font-semibold'>{formatDate(cert.issued_at)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Verification</p>
            {/* ✅ Fixed: was cert.issued_at before */}
            <p className='text-xs font-mono font-semibold text-primary'>{cert.certificate_code}</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-2 text-success'>
          <Shield className='h-5 w-5' />
          <span className='text-sm font-semibold'>Verified & Authentic</span>
          <CheckCircle className='h-5 w-5' />
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CertificatePage() {
  const params = useParams();
  const certId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const { data: cert, isLoading } = useQuery({
    queryKey: queryKeys.certificates.detail(certId),
    queryFn: () => certificateApi.getCertificateByCode(certId)
  });
  // ── PDF download ────────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    setIsCapturing(true); // Switch to capture-safe styles

    // Wait a frame so React re-renders the capture-safe styles before html2canvas reads the DOM
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,

        // ✅ FIX: force solid background (prevents white washed look)
        backgroundColor: '#ffffff',

        onclone: (clonedDoc) => {
          const body = clonedDoc.body;

          // Force clean white base for PDF rendering
          body.style.background = '#ffffff';

          // Remove transparency artifacts from Tailwind opacity classes
          clonedDoc.querySelectorAll('*').forEach((el: any) => {
            const style = el.style;

            // remove rgba backgrounds (causes washed look)
            if (style?.backgroundColor?.includes('rgba')) {
              style.backgroundColor = '#ffffff';
            }

            // remove blur effects
            if (style?.backdropFilter) {
              style.backdropFilter = 'none';
            }

            if (style?.filter?.includes('blur')) {
              style.filter = 'none';
            }
          });

          // Fix gradient text for PDF
          clonedDoc.querySelectorAll('.gradient-text').forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backgroundImage = 'none';
            htmlEl.style.webkitTextFillColor = 'unset';
            htmlEl.style.color = 'hsl(221, 83%, 53%)';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const canvasAspect = canvas.width / canvas.height;
      const pageAspect = pageW / pageH;

      let drawW: number, drawH: number, offsetX: number, offsetY: number;
      const margin = 10; // mm padding around the card

      if (canvasAspect > pageAspect) {
        drawW = pageW - margin * 2;
        drawH = drawW / canvasAspect;
        offsetX = margin;
        offsetY = (pageH - drawH) / 2;
      } else {
        drawH = pageH - margin * 2;
        drawW = drawH * canvasAspect;
        offsetX = (pageW - drawW) / 2;
        offsetY = margin;
      }

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);
      pdf.save(`certificate-${cert?.certificate_code ?? certId}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      toast({ variant: 'error', title: 'Download failed', description: 'Could not export PDF. Try again.' });
    } finally {
      setIsCapturing(false);
      setIsDownloading(false);
    }
  };

  // ── Share ───────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'My CareAble Certificate', url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ variant: 'success', title: 'Link copied!', description: 'Certificate URL copied to clipboard.' });
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center pt-16'>
        <div className='text-center space-y-3'>
          <Loader2 className='h-8 w-8 animate-spin text-primary mx-auto' />
          <p className='text-sm text-muted-foreground'>Loading your certificate…</p>
        </div>
      </div>
    );
  }

  if (!cert) return null;

  return (
    <div className='min-h-screen bg-background pt-20 pb-12 print:pt-0 print:pb-0'>
      <div className='container mx-auto px-4 max-w-3xl'>
        {/* Back link */}
        <div className='mb-6 print:hidden'>
          <Link
            href='/dashboard'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className='mb-8 space-y-2 text-center print:hidden animate-fade-in'>
          <Badge className='bg-success/10 text-success border-success/20'>
            <Award className='h-3.5 w-3.5 mr-1' />
            Certificate earned
          </Badge>
          <h1 className='text-3xl font-display font-bold'>Your Achievement Certificate</h1>
          <p className='text-muted-foreground text-sm'>Share this certificate to showcase your verified skills.</p>
        </div>

        {/* Certificate — ref used for PDF capture */}
        <div
          ref={printRef}
          className={`animate-scale-in ${isCapturing ? 'bg-white' : ''}`}
        >
          <CertificateCard
            cert={cert}
            isCapturing={isCapturing}
          />
        </div>

        {/* Actions */}
        <div className='mt-6 flex flex-wrap gap-3 justify-center print:hidden'>
          <Button
            variant='outline'
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
            {isDownloading ? 'Generating PDF…' : 'Download PDF'}
          </Button>
          <Button
            variant='outline'
            onClick={handleShare}
          >
            <Share2 className='h-4 w-4' />
            Share certificate
          </Button>
          <Button asChild>
            <Link href='/assessment'>Take another assessment</Link>
          </Button>
        </div>

        {/* Verification info */}
        <Card className='mt-8 print:hidden'>
          <CardContent className='p-6 space-y-4'>
            <div className='flex items-center gap-3'>
              <Shield className='h-5 w-5 text-success' />
              <h3 className='font-semibold'>How to verify this certificate</h3>
            </div>
            <p className='text-sm text-muted-foreground'>
              Anyone can verify the authenticity of this certificate using the verification code{' '}
              <span className='font-mono font-semibold text-primary'>{cert.certificate_code}</span> at{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/verify`}
                className='text-primary hover:underline inline-flex items-center gap-1'
              >
                CareAble.dev/verify <ExternalLink className='h-3 w-3' />
              </a>
            </p>
            <div className='flex flex-col sm:flex-row gap-4 text-sm'>
              <div className='flex-1 bg-secondary/50 rounded-lg p-3 space-y-1'>
                <p className='text-xs font-semibold text-muted-foreground uppercase'>Certificate ID</p>
                <p className='font-mono text-sm'>{cert.certificate_code}</p>
              </div>
              <div className='flex-1 bg-secondary/50 rounded-lg p-3 space-y-1'>
                <p className='text-xs font-semibold text-muted-foreground uppercase'>Verification code</p>
                <p className='font-mono text-sm text-primary'>{cert.certificate_code}</p>
              </div>
              <div className='flex-1 bg-secondary/50 rounded-lg p-3 space-y-1'>
                <p className='text-xs font-semibold text-muted-foreground uppercase'>Issued</p>
                <p className='text-sm'>{formatDate(cert.issued_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
