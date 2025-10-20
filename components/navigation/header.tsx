'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="font-semibold text-lg">Gladfore</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          {profile?.role === 'farmer' && (
            <Link href="/farmer/dashboard" className="hover:text-green-600">
              Farmer
            </Link>
          )}
          {profile?.role === 'agent' && (
            <Link href="/agent/dashboard" className="hover:text-green-600">
              Agent
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link href="/admin/dashboard" className="hover:text-green-600">
              Admin
            </Link>
          )}

          {profile ? (
            <>
              <span className="text-sm text-gray-600">{profile.full_name}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut()}
                className="ml-2"
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          <Link
            href="/"
            className="block text-sm hover:text-green-600"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {profile?.role === 'farmer' && (
            <Link
              href="/farmer/dashboard"
              className="block text-sm hover:text-green-600"
              onClick={() => setMenuOpen(false)}
            >
              Farmer
            </Link>
          )}
          {profile?.role === 'agent' && (
            <Link
              href="/agent/dashboard"
              className="block text-sm hover:text-green-600"
              onClick={() => setMenuOpen(false)}
            >
              Agent
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="block text-sm hover:text-green-600"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          {profile ? (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">{profile.full_name}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
              <Button size="sm" className="w-full">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
