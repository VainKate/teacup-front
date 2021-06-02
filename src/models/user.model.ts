import { Channel } from './channel.model';
import { Tag } from './tag.model';

export type AuthenticatedUser = {
  id: number;
  nickname: string;
  tags: Array<Tag>;
  channels: Array<Channel>;
};
