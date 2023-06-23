import { ProviderButton } from '@/components/ProviderButton';
import { SignInForm } from '@/components/SignInForm';

export default function SignIn() {
  const Providers = ['Google', 'Yandex', 'Github'];

  return (
    <div className="stack">
      <h1 className="home-title">Sign in</h1>
      {Providers.map((provider) => (
        <ProviderButton key={provider} providerId={provider} />
      ))}
      <div className="divide-line">or</div>
      <SignInForm />
    </div>
  );
}
