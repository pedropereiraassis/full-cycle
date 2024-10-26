import Image from 'next/image';
import React from 'react';

export const Logo = () => {
  return (
    <Image
      src='/logo.svg'
      alt='logo'
      width={90}
      height={90}
      className='cursor-pointer' />
  );
};
