const getRandomMiliseconds = () => {
  const currentTime = new Date().getTime();
  const randomNumber = Math.floor(currentTime * Math.random());
  return randomNumber;
};

export default getRandomMiliseconds;
