import { Tag } from './tag.model';

export class Channel {
  id!: number;
  title!: string;
  usersCount?: string;
  tags?: Array<Tag>;
  created_at?: string;
  updated_at?: string;
}
