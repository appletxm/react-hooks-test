import Friend from './friend.jsx';

function FriendList(props) {
  const { list } = props;

  return (
    <ul className="friend-list">
      {
        list.map((friend, index) => (
          <Friend friend={friend} key={friend.id}>{index}</Friend>
        ))
      }
    </ul>
  );
}

FriendList.propTypes = {
  list: PropTypes.array,
};

// FriendList.defaultProps = {
//   list: [],
// };

export default FriendList;
