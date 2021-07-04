import eventBus from 'common/event-bus';

const { useState, useEffect } = React;

function useFriendStatus(friendId) {
  const statusStr = `friendId-${friendId}-status`;
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status[0]);
    }
    eventBus.on(statusStr, handleStatusChange);
    // return () => {
    //   eventBus.off(statusStr, handleStatusChange);
    // };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

export default useFriendStatus;
