export default function getTimeFromCurrentDate(date: Date) {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}

function formatTimeLabel(timestamp: Date, timeSpan: number) {
  const date = new Date(timestamp);

  if (timeSpan < 1000 * 60 * 60) {
    // Less than an hour
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (timeSpan < 1000 * 60 * 60 * 24) {
    // Less than a day
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (timeSpan < 1000 * 60 * 60 * 24 * 30) {
    // Less than a month
    return date.toLocaleString("en-US", { month: "short", day: "numeric" });
  } else {
    // Greater than or equal to a month
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
}

export { formatTimeLabel };
