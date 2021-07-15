import { mapStore } from 'store/home';

const { observer, useLocalStore } = mobxReactLite;

export const CityView = ({ cities }) => (
  <ul>
    {cities.map((city, index) => <li key={`city-${index}`}>{city}</li>)}
  </ul>
);

export const CityList = () => {
  const allCities = useLocalStore(mapStore().allCities);
  if (!allCities) throw Error("Store shouldn't be null");

  return observer(() => <CityView cities={allCities} />);
};

export default CityList;
