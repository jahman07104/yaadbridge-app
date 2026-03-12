import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'YardBridge Consulting – Returning Residents of Jamaica',
  description:
    'YardBridge Consulting helps Jamaican returning residents and diaspora import household goods, vehicles, and tools of trade—stress-free and fully compliant.',
  openGraph: {
    title: 'YardBridge Consulting – Returning Residents of Jamaica',
    description:
      'End-to-end consulting for Jamaicans coming home. Customs guidance, vehicle import, tools of trade, and more.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-JM">
      <head>
        <meta name="theme-color" content="#0ea5e9" />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230ea5e9'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-size='16' font-weight='700' fill='white' font-family='sans-serif'%3EYB%3C/text%3E%3C/svg%3E"
          type="image/svg+xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="app gradient-mesh grain">
        <a className="skip-nav" href="#main-content">
          Skip to main content
        </a>
        <noscript>
          <div className="noscript-banner">
            For the best experience, please enable JavaScript in your browser.
          </div>
        </noscript>
        {children}
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
