const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
  const seconds = Math.floor(timeInSeconds - hours * 3600 - minutes * 60);

  const hoursString = hours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hoursString}h ${minutesString}m`;
  } else if (minutes > 0) {
    return `${minutesString}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export default formatTime;
