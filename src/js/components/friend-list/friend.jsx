import useFriendStatus from '../../hooks/online-state/index.jsx';

function Friend(props) {
  const { friend } = props;
  const status = useFriendStatus(friend.id);

  return (
    <li key={friend.id} style={{ color: status === 'Online' ? 'green' : 'gray' }}>{friend.name}</li>
  );
}

Friend.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
// Friend.defaultProps = {
//   friend: {},
// };

export default Friend;
