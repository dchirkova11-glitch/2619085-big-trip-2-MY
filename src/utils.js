import dayjs from 'dayjs';

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const pointDate = (date) => date ? dayjs(date).format('MMM DD') : '';
export const pointTime = (date) => date ? dayjs(date).format('HH:mm') : '';
export const formDate = (date) => date ? dayjs(date).format('DD/MM/YY HH:mm') : '';

export const getPointDuration = (dateFrom, dateTo) => {
  const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return hours > 0
    ? `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`
    : `${minutes}M`;
};
