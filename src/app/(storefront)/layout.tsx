import React from 'react';
import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';
import CartSidebar from 'src/components/CartSidebar';
import LoginModal from 'src/components/LoginModal';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-deep text-brand-text-primary">
      <Navbar />
      <main className="flex-1 w-full pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <LoginModal />
    </div>
  );
}
