export function getDaysInMonth(date) {
  const daysInMonth = [];
  const daysInMonthCount = date.daysInMonth();
  const firstDayOfMonth = date.startOf('month');

  for (let i = 0; i < daysInMonthCount; i++) {
    const day = firstDayOfMonth.clone().add(i, 'days');
    daysInMonth.push(day);
  }

  return daysInMonth;
}

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const formatDateString = (date) => {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};
