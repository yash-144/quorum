import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Community Treasury | DAO Governance on Stellar',
  description:
    'Decentralized treasury governance on Stellar testnet. Create proposals, vote, and execute payments — all on-chain.',
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
