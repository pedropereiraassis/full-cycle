'use client';

import React from 'react';
import { AuthForm } from '@/app/components/AuthForm';
import { InputField } from '@/app/components/InputField';

export default function ForgotPasswordForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Form submitted from Forgot Password');
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex w-full max-w-md flex-col space-y-4 rounded bg-[#141414] bg-opacity-90 px-4 py-8 shadow-lg'
    >
      <div className='flex flex-col items-center space-y-4'>
        <h1 className='text-3xl font-bold'>Forgot Password</h1>
        <p className='text-sm text-gray-500'>
          Enter your email to reset your password
        </p>
      </div>
      <div className='mt-8 flex flex-col space-y-4'>
        <InputField
          id='email'
          label='Email'
          type='email'
          placeholder='Enter your email'
        />
      </div>
      <div className='flex flex-col-reverse space-y-2 pt-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
        <button
          type='submit'
          className='flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 sm:w-auto sm:px-8'
        >
          Reset password
        </button>
      </div>
    </form>
  );
}
