'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

type Props = {
  providerId: string;
};

const ProviderButton = ({ providerId }: Props) => {
  console.log();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  return <button className="provider-btn" onClick={() => signIn(providerId.toLowerCase(), { callbackUrl })}>{`Sign in with ${providerId}`}</button>;
};

export { ProviderButton };
