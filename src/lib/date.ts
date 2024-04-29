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


/**
 * Calculates the relative time between two dates.
 *
 * @param {Date} fromDate - The starting date.
 * @param {Date} [toDate=new Date()] - The ending date. Defaults to the current date.
 * @param {("second" | "minute" | "hour" | "day" | "month" | "year")} [maximumUnit] - The maximum unit of time to display. Defaults to years.
 * @return {string} The relative time between the two dates. Returns "Unknown" if the difference is beyond the maximum unit.
 */
export function relativeTime(fromDate: Date, toDate: Date = new Date(), maximumUnit?: "second" | "minute" | "hour" | "day" | "month" | "year") {
  const units = [
    { max: maximumUnit === "second" ? Infinity : 1000 * 60, name: "second", divisor: 1000 },
    { max: maximumUnit === "minute" ? Infinity : 1000 * 60 * 60, name: "minute", divisor: 1000 * 60 },
    { max: maximumUnit === "hour" ? Infinity : 1000 * 60 * 60 * 24, name: "hour", divisor: 1000 * 60 * 60 },
    { max: maximumUnit === "day" ? Infinity : 1000 * 60 * 60 * 24 * 30, name: "day", divisor: 1000 * 60 * 60 * 24 },
    { max: maximumUnit === "month" ? Infinity : 1000 * 60 * 60 * 24 * 30 * 12, name: "month", divisor: 1000 * 60 * 60 * 24 * 30 },
    { max: Infinity, name: "year", divisor: 1000 * 60 * 60 * 24 * 365 },
  ];

  const millis = fromDate.getTime() - toDate.getTime();

  const unit = units.find((u) => Math.abs(millis) < u.max);
  if (!unit) return "Unknown";

  const difference = Math.round(millis / unit.divisor);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(difference, unit.name as any);
}
