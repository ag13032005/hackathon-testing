import './globals.css';

export const metadata = {
  title: 'EWIT Hackathon 2026 — Earth & Innovation | National Level 24-Hour Hackathon',
  description: 'Join the National Level 24-Hour Hackathon hosted by East West Institute of Technology. Compete across 5 tracks including AI, HealthTech, Sustainability, Smart Cities & Open Innovation. ₹1,00,000 prize pool.',
  keywords: 'hackathon, EWIT, East West Institute of Technology, coding, innovation, sustainability, AI, HealthTech, Smart Cities',
  openGraph: {
    title: 'EWIT Hackathon 2026 — Earth & Innovation',
    description: 'National Level 24-Hour Hackathon with ₹1,00,000 prize pool. 5 Tracks. Infinite Possibilities.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
