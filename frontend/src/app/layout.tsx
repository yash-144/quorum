import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Community Treasury',
  description: 'Treasury governance on Stellar testnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
