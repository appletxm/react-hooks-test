const { useObserver, useLocalStore } = mobxReactLite

export default function Person() {
  const person = useLocalStore(() => ({ name: 'John' }))

  // const person = {name: 'Jhon'}

  return useObserver(() =>
    <div>
      {person.name}
      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
    </div>
  )
}
