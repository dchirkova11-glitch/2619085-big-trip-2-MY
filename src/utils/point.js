import dayjs from 'dayjs';

const DateFormat = {
  POINT_DATE: 'MMM DD',
  POINT_TIME: 'HH:mm',
  FORM_DATE: 'DD/MM/YY HH:mm',
};

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

const formatDate = (date, format) => date ? dayjs(date).format(format) : '';

const padNumber = (number) => String(number).padStart(2, '0');

export const formatPointDate = (date) => formatDate(date, DateFormat.POINT_DATE);
export const formatPointTime = (date) => formatDate(date, DateFormat.POINT_TIME);
export const formatFormDate = (date) => formatDate(date, DateFormat.FORM_DATE);

export const getPointDuration = (dateFrom, dateTo) => {
  const totalMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(totalMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((totalMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  if (days > 0) {
    return `${padNumber(days)}D ${padNumber(hours)}H ${padNumber(minutes)}M`;
  }

  if (hours > 0) {
    return `${padNumber(hours)}H ${padNumber(minutes)}M`;
  }

  return `${padNumber(minutes)}M`;
};

export const isPointFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());
export const isPointPast = (point) => dayjs(point.dateTo).isBefore(dayjs());
export const isPointPresent = (point) => !isPointFuture(point) && !isPointPast(point);

export const sortPointByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
export const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
export const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};
