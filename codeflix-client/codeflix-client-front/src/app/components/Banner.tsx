import React from 'react';
import Image from 'next/image';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { Movie } from '../types/movie';
import Link from 'next/link';

export function Banner({ movie }: { movie: Movie }) {
  return (
    <div className='mb-10'>
      <div className='flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
        <div className='absolute left-0 top-0 -z-10 flex h-[95vh] w-screen flex-col bg-black'>
          <video
            autoPlay
            loop
            muted
            poster={movie.bannerFileURL}
            src={movie.videoFileURL}
            className='z-20 hidden h-full w-full object-cover opacity-50 transition duration-1000 ease-in-out lg:block'
          ></video>
          <Image
            src={movie.bannerFileURL}
            alt={movie.title}
            fill={true}
            className='opacity-38 object-cover object-top filter lg:hidden'
          />
        </div>

        <h1 className='text-2xl font-bold md:text-4xl lg:text-7xl'>
          {movie.title}
        </h1>

        <p className='text-shadow-md max-w-xs text-xs md:max-w-lg md:text-lg lg:max-w-2xl'>
          {movie.description}
        </p>
      </div>

      <div className='flex space-x-3'>
        <Link href={`/watch/${movie.id}`}>
          <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:px-8 md:py-2.5'>
            <PlayIcon className='h-6' />
            Play
          </button>
        </Link>
        <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-gray-600 px-5 py-1.5 text-sm font-semibold text-white transition hover:opacity-75 md:px-8 md:py-2.5'>
          <InformationCircleIcon className='h-6' />
          More Info
        </button>
      </div>
    </div>
  );
}
