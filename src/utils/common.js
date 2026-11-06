export const updateItem = (items, update) => items
  .map((item) => item.id === update.id ? update : item);

export const capitalize = (string) => string[0].toUpperCase() + string.slice(1);
