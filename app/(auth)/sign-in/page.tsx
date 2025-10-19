 'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

type FormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const methods = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast({ title: 'Sign in failed', description: String(error.message || error) });
      return;
    }
    toast({ title: 'Signed in', description: 'Welcome back' });
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...methods.register('email', { required: 'Email required' })} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" {...methods.register('password', { required: 'Password required' })} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit">Sign in</Button>
        </form>
      </Form>
    </div>
  );
}
