import ToDo from './todo';
import ToDoList from './todo-list';
import * as map from './map';

export const todoList = new ToDoList([new ToDo('Get Coffee'), new ToDo('Write simpler code')]);

export default {
  todoList,
  map,
};
