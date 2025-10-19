 'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UserRole } from '@/lib/supabase/types';

type FormValues = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const methods = useForm<FormValues>({
    defaultValues: { email: '', password: '', fullName: '', role: 'farmer' },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await signUp(data.email, data.password, data.fullName, data.role, data.phone);
    if (error) {
      toast({ title: 'Sign up failed', description: String(error.message || error) });
      return;
    }
    toast({ title: 'Account created', description: 'Please check your email to confirm' });
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input {...methods.register('fullName', { required: 'Full name required' })} />
            </FormControl>
            <FormMessage />
          </FormItem>

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

          <FormItem>
            <FormLabel>Phone (optional)</FormLabel>
            <FormControl>
              <Input {...methods.register('phone')} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <select
                className="w-full rounded-md border px-3 py-2"
                {...methods.register('role')}
              >
                <option value="farmer">Farmer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit">Create account</Button>
        </form>
      </Form>
    </div>
  );
}
