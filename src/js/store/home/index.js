import ToDo from './todo'
import ToDoList from './todo-list'
import mapStore from './map'

const todoList = new ToDoList([new ToDo("Get Coffee"), new ToDo("Write simpler code")])

export {
  todoList,
  mapStore
}
