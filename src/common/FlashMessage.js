import React, {  useEffect } from 'react';

function Toast(props) {
  const { removeFlashMessage, toast } = props;
  useEffect(() => {
    const timerId = setTimeout(() => {
      removeFlashMessage(toast.date);
    }, 5000);
    return () => { clearTimeout(timerId) };;
  }, [removeFlashMessage, toast]);

  return (
    <div className={`flash-message ${toast.type}`}>{toast.message}</div>
  );
}

export default function FlashMessage(props) {
  const { flashMessage, removeFlashMessage } = props;

  return (
    <div className='flash-message-container'>
      {flashMessage.map((toast) =>
        <Toast key={toast.date} toast={toast} removeFlashMessage={removeFlashMessage}/>
      )}
    </div>
  );
}
