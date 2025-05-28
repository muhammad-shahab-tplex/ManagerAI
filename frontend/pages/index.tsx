import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Index() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/homepage');
  }, [router]);
  
  return (
    <div>
      <Head>
        <title>Redirecting...</title>
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Redirecting to homepage...
      </div>
    </div>
  );
} 