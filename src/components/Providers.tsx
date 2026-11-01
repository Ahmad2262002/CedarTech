'use client';

import React from 'react';
import { AuthProvider } from 'src/lib/context/AuthContext';
import { CartProvider } from 'src/lib/context/CartContext';
import { LanguageProvider } from 'src/context/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
