const { useObserver } = mobxReactLite;

const TodoListView = ({ todoList }) => useObserver(() => (
  <div className={'todo-list-test'}>
    <ul>
      {todoList.todos.map((todo, index) => (
        <li key={`todo-${index}`}>
          <input type="checkbox" checked={todo.finished} onClick={() => todo.toggle()} />
          {todo.title}
        </li>
      ))}
    </ul>
    Tasks left: {todoList.unfinishedTodoCount}
  </div>));

export default TodoListView;
