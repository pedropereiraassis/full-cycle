const textColor = (rating: string) => {
  switch (rating) {
    case 'pg':
      return 'text-green-500';
    case 'pg-13':
      return 'text-yellow-500';
    case 'r':
      return 'text-red-500';
    case 'nc-17':
      return 'text-red-700';
    default:
      return 'text-white';
  }
};

export const MovieRating = ({ rating }: { rating: string }) => {
  return (
    <span
      className={`border-1 border border-gray-700 px-2 text-sm uppercase ${textColor(
        rating
      )}`}
    >
      {rating}
    </span>
  );
};
