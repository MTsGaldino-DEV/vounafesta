import { NextResponse, type NextRequest } from 'next/server';
import { organizerClient } from '@/lib/supabase';

// Destino do link do e-mail de recuperação de senha: troca o código por uma sessão.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const supabase = await organizerClient();
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/organizador/redefinir', request.url));
  }
  return NextResponse.redirect(new URL('/organizador/recuperar?erro=1', request.url));
}
