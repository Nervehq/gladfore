 'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

type FormValues = {
  email: string;
};

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const methods = useForm<FormValues>({ defaultValues: { email: '' } });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: typeof window !== 'undefined' ? window.location.origin + '/' : undefined,
    });

    if (error) {
      toast({ title: 'Reset failed', description: String(error.message || error) });
      return;
    }

    toast({ title: 'Reset email sent', description: 'Check your email for reset instructions' });
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Reset password</h1>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...methods.register('email', { required: 'Email required' })} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit">Send reset email</Button>
        </form>
      </Form>
    </div>
  );
}
