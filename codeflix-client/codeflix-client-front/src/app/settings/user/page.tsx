import BuggyButton from '@/app/components/BuggyButton';
import { getUserInfo } from '@/app/lib/settings';
import React from 'react';

export default async function User() {
  const { name, email, age } = await getUserInfo();
  return (
    <div>
      <h1 className='text-2xl font-bold'>User Page</h1>

      <div className='border border-dashed border-red-500 p-4'>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
      </div>

      <div className='mt-4'>
        <BuggyButton />
      </div>
    </div>
  );
}
