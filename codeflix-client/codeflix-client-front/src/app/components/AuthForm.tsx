'use client';

import React from 'react';
import { InputField } from './InputField';

export type AuthFormProps = {
  formType: 'login' | 'register';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({ formType, onSubmit }) => {
  const formProps = {
    title: 'Login',
    questionText: 'New to the app?',
    link: '/auth/register',
    linkText: 'Register',
  };
  if (formType === 'register') {
    formProps.title = 'Register';
    formProps.questionText = 'Already have an account?';
    formProps.link = '/auth/login';
    formProps.linkText = 'Login';
  }

  return (
    <form
      onSubmit={onSubmit}
      className='flex w-full max-w-md flex-col space-y-4 rounded bg-[#141414] bg-opacity-90 px-4 py-8 shadow-lg'
    >
      <div className='flex flex-col items-center space-y-4'>
        <h1 className='text-3xl font-bold'>{formProps.title}</h1>
        <p className='text-sm text-gray-500'>
          {formProps.questionText + ' '}
          <a href={formProps.link} className='text-red-500 hover:underline'>
            {formProps.linkText}
          </a>
        </p>
      </div>
      <div className='mt-8 flex flex-col space-y-4'>
        <InputField
          id='email'
          label='Email'
          type='email'
          placeholder='Enter your email'
        />

        <InputField
          id='password'
          label='Password'
          type='password'
          placeholder='Enter your password'
        />

        {formType === 'register' && (
          <InputField
            id='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='Confirm your password'
          />
        )}
      </div>
      <div className='flex flex-col-reverse space-y-2 pt-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
        <button
          type='submit'
          className='flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 sm:w-auto sm:px-8'
        >
          {formProps.title}
        </button>
      </div>
    </form>
  );
};
