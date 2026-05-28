"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const initialError = params.get("error");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-100/60 backdrop-blur p-5">
        <p className="font-medium text-stone-900">Check your inbox.</p>
        <p className="text-sm text-stone-600 mt-1">
          We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
        </p>
        <p className="text-xs text-stone-500 mt-3">
          Didn&rsquo;t get it? Check spam, then{" "}
          <button
            type="button"
            onClick={() => { setSent(false); setError(null); }}
            className="underline"
          >
            try again
          </button>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full rounded-full" disabled={submitting || !email}>
        {submitting ? "Sending…" : "Send sign-in link"}
      </Button>
      <p className="text-xs text-stone-500 text-center">
        We&rsquo;ll email you a one-time sign-in link. No passwords.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="text-stone-600 mt-1">Welcome back to BigSkyHarvest.</p>
      <Suspense fallback={<div className="mt-8 h-32" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
