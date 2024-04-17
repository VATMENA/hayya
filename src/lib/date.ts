export function humanReadableDate(d: Date): string {
  // Sat Feb 17, 2024, 18:00 (EST)
  const options: Intl.DateTimeFormatOptions = {
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
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function relativeTime(fromDate: Date, toDate: Date = new Date()) {
  const units = [
    { max: 1000 * 60, name: "second", divisor: 1000 },
    { max: 1000 * 60 * 60, name: "minute", divisor: 1000 * 60 },
    { max: 1000 * 60 * 60 * 24, name: "hour", divisor: 1000 * 60 * 60 },
    { max: Infinity, name: "day", divisor: 1000 * 60 * 60 * 24 },
  ];

  const millis = fromDate.getTime() - toDate.getTime();

  const unit = units.find((u) => Math.abs(millis) < u.max);
  if (!unit) return "Unknown";

  const difference = Math.round(millis / unit.divisor);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(difference, unit.name as any);
}
