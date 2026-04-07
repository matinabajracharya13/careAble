"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Award, Download, Share2, Shield, CheckCircle, Calendar,
  Star, Loader2, ArrowLeft, ExternalLink, QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, Badge, Separator } from "@/components/ui/ui-components";
import { certificateApi } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { cn, formatDate } from "@/lib/utils";

// ── Certificate visual ────────────────────────────────────────────────────────
function CertificateCard({ cert }: { cert: any }) {
  return (
    <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border-4 border-primary/20 rounded-2xl p-10 overflow-hidden print:rounded-none print:border-2">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 h-48 w-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 text-center space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-display font-bold text-lg">SB</span>
          </div>
          <div className="text-left">
            <p className="font-display font-bold text-xl text-foreground">SkillBridge</p>
            <p className="text-xs text-muted-foreground">Academy of Professional Skills</p>
          </div>
        </div>

        <Separator />

        {/* Certificate title */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Certificate of Achievement</p>
          <h1 className="text-2xl font-display font-bold text-foreground">This certifies that</h1>
        </div>

        {/* Recipient */}
        <div className="space-y-1">
          <h2 className="text-4xl font-display italic font-bold gradient-text">{cert.userName}</h2>
          <p className="text-sm text-muted-foreground">has successfully demonstrated proficiency in</p>
        </div>

        {/* Assessment title */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-8 py-4">
          <h3 className="text-2xl font-display font-bold text-primary">{cert.assessmentTitle}</h3>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-xs text-muted-foreground">{cert.category}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs font-semibold capitalize text-foreground">{cert.level} Level</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-success font-semibold">{cert.score}% score</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-5 w-5", i < Math.round(cert.score / 20) ? "fill-warning text-warning" : "text-muted-foreground/20")} />
          ))}
        </div>

        <Separator />

        {/* Footer meta */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Issued by</p>
            <p className="text-sm font-semibold">{cert.issuerName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issue date</p>
            <p className="text-sm font-semibold">{formatDate(cert.issuedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Verification</p>
            <p className="text-xs font-mono font-semibold text-primary">{cert.verificationCode}</p>
          </div>
        </div>

        {/* Seal */}
        <div className="flex items-center justify-center gap-2 text-success">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-semibold">Verified & Authentic</span>
          <CheckCircle className="h-5 w-5" />
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

  const { data: cert, isLoading } = useQuery({
    queryKey: ["certificate", certId],
    queryFn: () => certificateApi.getCertificate(certId),
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "My SkillBridge Certificate", url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ variant: "success", title: "Link copied!", description: "Certificate URL copied to clipboard." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your certificate…</p>
        </div>
      </div>
    );
  }

  if (!cert) return null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 print:pt-0 print:pb-0">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link - hidden in print */}
        <div className="mb-6 print:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        {/* Page header - hidden in print */}
        <div className="mb-8 space-y-2 text-center print:hidden animate-fade-in">
          <Badge className="bg-success/10 text-success border-success/20">
            <Award className="h-3.5 w-3.5 mr-1" />
            Certificate earned
          </Badge>
          <h1 className="text-3xl font-display font-bold">Your Achievement Certificate</h1>
          <p className="text-muted-foreground text-sm">Share this certificate to showcase your verified skills.</p>
        </div>

        {/* Certificate */}
        <div ref={printRef} className="animate-scale-in">
          <CertificateCard cert={cert} />
        </div>

        {/* Actions - hidden in print */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="h-4 w-4" />
            Download / Print
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share certificate
          </Button>
          <Button asChild>
            <Link href="/assessment">
              Take another assessment
            </Link>
          </Button>
        </div>

        {/* Verification info - hidden in print */}
        <Card className="mt-8 print:hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-success" />
              <h3 className="font-semibold">How to verify this certificate</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone can verify the authenticity of this certificate using the verification code{" "}
              <span className="font-mono font-semibold text-primary">{cert.verificationCode}</span>{" "}
              at{" "}
              <a href="https://skillbridge.dev/verify" className="text-primary hover:underline inline-flex items-center gap-1">
                skillbridge.dev/verify <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Certificate ID</p>
                <p className="font-mono text-sm">{cert.id}</p>
              </div>
              <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Verification code</p>
                <p className="font-mono text-sm text-primary">{cert.verificationCode}</p>
              </div>
              <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Issued</p>
                <p className="text-sm">{formatDate(cert.issuedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
