export const DateFormatting = (rawDate: Date) => {
  const date = new Date(rawDate);

  const formatted = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long"
  });

  return formatted;
};
