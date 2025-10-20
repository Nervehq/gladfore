'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
    

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Affordable fertilizer. Better yields.</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Galdfore fertilizer helps farmers get healthier crops and higher yields. Buy today with 50:50 financing:
                  pay 50% up front and settle the remaining 50% after harvest or sales.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
                  <Link href="/(auth)/sign-up">
                    <Button className="w-full sm:w-auto">Apply for financing</Button>
                  </Link>
                  <a href="#how-it-works" className="w-full sm:w-auto text-center text-sm text-muted-foreground hover:underline">How it works</a>
                </div>
              </div>

              <div className="bg-green-50 rounded-md p-4">
                <div className="text-sm font-medium text-green-900">50 : 50 Financing</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Pay 50% up front to receive Galdfore fertilizer today. Repay the remaining 50% after harvest — simple schedules, clear terms.
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border text-center">
                    <div className="text-xs text-muted-foreground">Example total</div>
                    <div className="text-lg font-semibold">₦10,000</div>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <div className="text-xs text-muted-foreground">Upfront (50%)</div>
                    <div className="text-lg font-semibold">₦5,000</div>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <div className="text-xs text-muted-foreground">Balance</div>
                    <div className="text-lg font-semibold">₦5,000</div>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <div className="text-xs text-muted-foreground">Repayment</div>
                    <div className="text-lg font-semibold">After harvest</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="how-it-works" className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-semibold">Step 1</h3>
              <p className="text-sm text-muted-foreground mt-2">Sign up as a farmer and provide a few farm details.</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-semibold">Step 2</h3>
              <p className="text-sm text-muted-foreground mt-2">Apply for Galdfore fertilizer and pay a 50% upfront fee.</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-semibold">Step 3</h3>
              <p className="text-sm text-muted-foreground mt-2">Receive fertilizer and pay the remaining balance after harvest via easy installments.</p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Why farmers choose Galdfore</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Trusted fertilizer blend for improved yields</li>
              <li>Flexible 50:50 financing — buy now, pay after harvest</li>
              <li>Simple repayment schedules and local support</li>
            </ul>
            <div className="mt-6">
              <Link href="/(auth)/sign-up">
                <Button>Get Galdfore fertilizer</Button>
              </Link>
            </div>
          </section>

          <footer className="text-center text-sm text-muted-foreground py-8">
            <div>© {new Date().getFullYear()} Galdfore</div>
            <div className="mt-2">
              <div>Contact: Opposite Total Filling Station, Sabo, Kachia Road, Kaduna</div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}