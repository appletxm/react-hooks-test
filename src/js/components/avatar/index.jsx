function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

Avatar.propTypes = {
  user: PropTypes.object,
};

export default Avatar;
