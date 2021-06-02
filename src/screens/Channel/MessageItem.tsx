import { Message } from '../../types';

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return <p>{message.content}</p>;
};

export default MessageItem;
