import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quorum | DAO Governance on Stellar',
  description:
    'Quorum is a decentralized treasury governance app on Stellar Soroban. Create proposals, vote, and execute on-chain payments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
