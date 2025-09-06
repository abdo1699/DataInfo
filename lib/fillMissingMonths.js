// Utility to ensure area chart data always includes all months
export function fillMissingMonths(data, valueKey = "value") {
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
  // Create a map for quick lookup
  const dataMap = Object.fromEntries(data.map((d) => [d.name, d[valueKey]]));
  // Fill missing months with zero
  return months.map((month) => ({
    name: month,
    [valueKey]: dataMap[month] ?? 0,
  }));
}
