const Cities = [
  'Amsterdam',
  'London',
  'Madrid',
];

export const mapStore = () => {
  const store = {
    get allCities() {
      return Cities;
    },
  };

  return store;
};

export default mapStore;
