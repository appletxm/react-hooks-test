const { observable, autorun } = mobx

const todos = observable([
  { title: "Spoil tea", completed: true },
  { title: "Make coffee", completed: false }
])

autorun(() => {
  console.log(
      "Remaining:",
      todos
          .filter(todo => !todo.completed)
          .map(todo => todo.title)
          .join(", ")
  )
})

export default todos
