import { getUserById } from '@/app/lib/settings';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function User({ params }: { params: { id: string } }) {
  const { name, email, website } = await getUserById(params.id);

  if (!name) {
    notFound();
  }
  return (
    <div>
      <h1 className='text-2xl font-bold'>User Page</h1>

      <div className='border border-dashed border-red-500 p-4'>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Website: {website}</p>
      </div>
    </div>
  );
}
