const detault = {
  appPrefix: '',
  needShowLoginPop: false,
};
export const setInitialStates = (initialStates) => Object.assign(detault, initialStates);
export default setInitialStates;
