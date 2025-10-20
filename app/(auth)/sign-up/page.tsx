'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'agent' | 'admin'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      return toast({ title: 'Missing fields', description: 'Please fill all required fields' });
    }

    if (password !== confirm) {
      return toast({ title: 'Password mismatch', description: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return toast({ title: 'Weak password', description: 'Password must be at least 8 characters long' });
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (error) {
        console.error(error);
        toast({
          title: 'Sign up failed',
          description: error.message || 'An unexpected error occurred',
        });
        return;
      }

      if (data?.user) {
        toast({
          title: 'Account created successfully',
          description: 'Redirecting to your dashboard…',
        });

        // Redirect user by role
        setTimeout(() => {
          if (role === 'agent') router.push('/agent/dashboard');
          else if (role === 'admin') router.push('/admin/dashboard');
          else router.push('/farmer/dashboard');
        }, 1500);
      } else {
        toast({
          title: 'Check your email',
          description: 'A confirmation link has been sent to your inbox.',
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message || 'Unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Sign up and get started with your dashboard</p>
        </header>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring focus:ring-primary/20 focus:outline-none"
              required
            >
              <option value="farmer">Farmer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={8}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm password</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
              minLength={8}
            />
          </div>

          {/* Sign In Link */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">Already have an account?</p>
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
