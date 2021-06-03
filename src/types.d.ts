export type SocketAuthPacket = {
  channel: Pick<Channel, 'id'>;
  user: Pick<AuthenticatedUser, 'id' | 'nickname'>;
};

export type Message = {
  id?: string;
  content: string;
} & SocketAuthPacket;

export type AuthenticatedUser = {
  id: number;
  nickname: string;
  tags: Array<Tag>;
  channels: Array<Channel>;
};

export type ChannelUser = {
  isLogged: boolean;
} & Pick<AuthenticatedUser, 'id' | 'nickname'>;

export type Tag = {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
};

export type Channel = {
  id: number;
  title: string;
  usersCount?: string;
  tags?: Array<Tag>;
  users?: Array<ChannelUser>;
  created_at?: string;
  updated_at?: string;
};
