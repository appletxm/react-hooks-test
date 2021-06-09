import UserInfo from 'components/user-info'

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author || {}} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {props.date || new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

export default Comment
