import Button from 'components/button';
import Input from 'components/input';
import AppCtx from 'providers/app-ctx';
import Counter from 'hooks/counter';
import FriendList from 'components/friend-list';
import eventBus from 'common/event-bus';
import Counter2 from 'hooks/counter/reducer-version';
// import CityList from 'components/city-list'
import { todoList } from 'store/home';
import TodoListView from 'components/todo-list-view';
import MobxTest from 'components/mobx-test';
import autoTest from 'store/home/auto-test';

const friendData = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

setTimeout(() => {
  eventBus.emit('friendId-2-status', 1);
}, 1000);

setTimeout(() => {
  eventBus.emit('friendId-2-status', 0);
}, 5000);

class Home extends React.Component {
  static contextType = AppCtx

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.inputEl = null;
  }

  componentDidMount() {
    console.info('====', this.ref.current);
    // this.inputEl.focus()
    console.info('====', this.inputEl);

    autoTest[0].completed = false;
    // Prints: 'Remaining: Spoil tea, Make coffee'
    autoTest[2] = { title: 'Take a nap', completed: false };
    // Prints: 'Remaining: Spoil tea, Make coffee, Take a nap'
    autoTest.shift();
    // Prints: 'Remaining: Make coffee, Take a nap'
  }

  sendInfo() {
    console.info('----sendInfo start----', JSON.stringify(window.wx));
    try {
      testWx('9999');
    } catch (err) {
      console.info('===err===', err);
    }
    console.info('----sendInfo end----');
  }

  render() {
    // console.info('===home page==', this.context);
    const { appPrefix } = this.context;
    const pageCss = `${appPrefix}-p-home`;

    return (
      <div className={pageCss}>
        this is Home page {this.context.name}
        <Button ref={this.ref}>test button 6666</Button>
        <Input inputRef={(el) => { console.info('###', el); this.inputEl = el; }}/>
        <x-search name="web components" class="x-search-red"></x-search>
        <Counter></Counter>
        <FriendList list={friendData}></FriendList>
        <Counter2></Counter2>
        {/* <CityList></CityList> */}
        <TodoListView todoList={todoList}></TodoListView>

        <MobxTest></MobxTest>

        <ul>
          {
            autoTest.map((item, index) => (<li key={`test-auto-${index}`}>{item.title}</li>))
          }
        </ul>

        <button className={'test-btn-send'} onClick={this.sendInfo.bind(this)}>send info</button>
      </div>
    );
  }
}

export default Home;
