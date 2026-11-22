import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource/allura';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Vou na Festa', template: '%s | Vou na Festa' },
  description: 'Confirme sua presença e saiba quem vai à sua festa.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
