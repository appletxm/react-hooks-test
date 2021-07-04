import Button from 'components/button';
import Input from 'components/input';
import AppCtx from 'providers/app-ctx';
import Counter from 'hooks/counter';
import FriendList from 'components/friend-list';
import eventBus from 'common/event-bus';

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
      </div>
    );
  }
}

export default Home;
