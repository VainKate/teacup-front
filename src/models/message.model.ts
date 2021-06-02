import { Channel } from './channel.model';
import { AuthenticatedUser } from './user.model';

export type Message = {
  id: string;
  user: Pick<AuthenticatedUser, 'id' | 'nickname'>;
  channel: Pick<Channel, 'id'>;
  content: string;
};
