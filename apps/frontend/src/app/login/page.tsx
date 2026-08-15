import { LoginPage } from '@/components/layout/login-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | POS Nepal',
};

export default function Login() {
  return <LoginPage />;
}
