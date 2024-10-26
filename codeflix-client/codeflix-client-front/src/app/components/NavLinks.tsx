import React from 'react';

export const NavLinks = () => {
  return (
    <nav>
      <ul className='hidden md:flex md:space-x-4'>
        <li>Home</li>
        <li>TV Shows</li>
        <li>Movies</li>
        <li>Latest</li>
        <li>My List</li>
      </ul>
    </nav>
  );
};
