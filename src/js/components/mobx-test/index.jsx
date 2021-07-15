const { useObserver, useLocalStore } = mobxReactLite;

export default function Person() {
  const person = useLocalStore(() => { 'John'; });

  // const person = {name: 'Jhon'}

  /* eslint-disable */
  return useObserver(() => <div>
      {person.name}
      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
  </div>);
  /* eslint-enable */
}
