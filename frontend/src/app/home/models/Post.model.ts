export class Post {
  _id!: string;
  description!: string;
  userEmail!: string;
  likes!: number;
  imageUrl!: string;
  usersLiked!: string[];
  userId!: string;
  date!: Date | string;
  isLiked!: boolean;
  userAdmin!: boolean;
}
