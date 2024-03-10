export function humanReadableDate(d: Date): string {
  // Sat Feb 17, 2024, 18:00 (EST)
  let options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function humanReadableDateOnly(d: Date): string {
  // Sat Feb 17, 2024, 18:00 (EST)
  let options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(d);
}
