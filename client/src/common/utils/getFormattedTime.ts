const getFormattedTime = (unFormattedTime: String, extended = false) => {
  const [year, month, date, hour, minute] = unFormattedTime.split("-");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const hourNum = parseInt(hour);

  if (
    hourNum < 0 ||
    hourNum > 23 ||
    parseInt(minute) < 0 ||
    parseInt(minute) > 59
  ) {
    throw new Error("Invalid input time");
  }

  const meridian = hourNum < 12 ? "AM" : "PM";
  const formattedHour =
    hourNum === 0 ? "12" : hourNum <= 12 ? hour : (hourNum - 12).toString();

  if (extended) {
    return `${date}-${
      months[parseInt(month)]
    }-${year} ${formattedHour}:${minute.padStart(2, "0")} ${meridian}`;
  } else {
    return `${formattedHour}:${minute.padStart(2, "0")} ${meridian}`;
  }
};

export default getFormattedTime;
