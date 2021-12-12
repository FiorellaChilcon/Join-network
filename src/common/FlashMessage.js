import React, {  useEffect } from 'react';

export default function FlashMessage(props) {
  const { flashMessage, removeFlashMessage } = props;
  useEffect(() => {
    const timerId = setTimeout(() => {
      removeFlashMessage();
    }, 5000);
    return () => { clearTimeout(timerId) };;
  }, [flashMessage, removeFlashMessage]);

  return (
    <div className={`flash-message ${flashMessage.type}`}>{flashMessage.message}</div>
  );
}
