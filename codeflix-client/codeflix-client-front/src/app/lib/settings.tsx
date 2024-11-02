export const getAppSettings = (): Promise<{
  theme: string;
  language: string;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        theme: 'dark',
        language: 'en',
      });
    }, 2000);
  });
};

export const getUserInfo = (): Promise<{
  name: string;
  email: string;
  age: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'johndoe@email.com',
        age: 30,
      });
    }, 2000);
  });
};

export const getUserById = async (
  id: string
): Promise<{
  name: string;
  email: string;
  website: string;
}> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return await response.json();
};
