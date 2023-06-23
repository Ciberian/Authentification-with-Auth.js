'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { FormEventHandler } from 'react';

const SignInForm = () => {
  const router = useRouter();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (result && !result.error) {
      router.push('/profile');
    } else {
      console.log(result);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="login-form">
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" name="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" name="password" required />
      <button className='provider-btn' type="submit">Sign In</button>
    </form>
  );
};

export { SignInForm };
