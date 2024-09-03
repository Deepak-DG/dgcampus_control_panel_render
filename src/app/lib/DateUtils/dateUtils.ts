// utils/dateUtils.ts

export const formatDate = (dateString: string | null): string => {
  if (!dateString) {
    return ''; // Return an empty string or a default message if dateString is null or undefined
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or a default message if the date is invalid
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
};
