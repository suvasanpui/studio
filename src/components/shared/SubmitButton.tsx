'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </Button>
  );
}
