function formatDate(isoDate: string | null): string {
  if (!isoDate) {
    return "";
  }
  const date = new Date(isoDate);

  // Get month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[date.getUTCMonth()];
  const day = date.getDate();

  // Get hours and format it to 12-hour format
  let hours = date.getHours();

  let minutes = date.getMinutes().toString();
  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format the final string
  const formattedDate = `${month} ${day} | ${hours}:${minutes} ${ampm}`;
  return formattedDate;
}

export default formatDate;
