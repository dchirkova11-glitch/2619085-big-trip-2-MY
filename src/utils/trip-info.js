import he from 'he';
import dayjs from 'dayjs';

const MAX_CITIES_COUNT = 3;
const TRIP_DATE_FORMAT = 'D MMM';

export const getTripTitle = (points, destinations) => {
  const cityNames = points.map((point) =>
    he.encode(destinations.find((city) => city.id === point.destination).name)
  );

  if(cityNames.length > MAX_CITIES_COUNT) {
    return `${cityNames[0]} &mdash; ... &mdash; ${cityNames.at(-1)}`;
  }

  return cityNames.join(' &mdash; ');
};

export const getTripDates = (points) => {
  const startDate = dayjs(points[0].dateFrom).format(TRIP_DATE_FORMAT);
  const endDate = dayjs(points.at(-1).dateTo).format(TRIP_DATE_FORMAT);

  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getPointOffersCost = (point, offers) => {
  const typeOffers = offers.find((offerGroup) => offerGroup.type === point.type).offers;

  return typeOffers
    .filter((offer) => point.offers.includes(offer.id))
    .reduce((sum, offer) => sum + offer.price, 0);
};

export const getTripCost = (points, offers) => points.reduce(
  (sum, point) => sum + point.basePrice + getPointOffersCost(point, offers),
  0
);
