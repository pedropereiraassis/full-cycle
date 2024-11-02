'use client';

import React from 'react';
import { AuthForm } from '@/app/components/AuthForm';

export default function RegisterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Form submitted from Register');
    e.preventDefault();
  };

  return <AuthForm formType='register' onSubmit={handleSubmit} />;
}
