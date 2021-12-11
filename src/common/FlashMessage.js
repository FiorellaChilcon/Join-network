import React, {  useEffect } from 'react';

export default function FlashMessage(props) {
  const { flashMessage, removeFlashMessage, type } = props;
  useEffect(() => {
    const timerId = setTimeout(() => {
      removeFlashMessage();
    }, 5000);
    return () => { clearTimeout(timerId) };;
  }, [flashMessage, removeFlashMessage]);

  return (
    <div className={`flash-message ${type}`}>{flashMessage.message}</div>
  );
}
