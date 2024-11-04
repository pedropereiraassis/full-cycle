'use client';

import React, { FormEvent, useState } from 'react';
import { AuthForm } from '@/app/components/AuthForm';
import { useRouter } from 'next/navigation';

type ServerError = {
  message: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/auth/login/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/');
        return;
      }

      const payload: ServerError[] = await response.json();
      setErrors(payload.map((err) => err.message));
      console.error(errors);
    } catch (error) {
      console.error(error);
      setErrors(['An unexpected error occurred.']);
    }
  };

  return <AuthForm formType='login' onSubmit={handleSubmit} />;
}
