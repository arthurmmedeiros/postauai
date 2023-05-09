import { type User } from "@clerk/nextjs/dist/server/clerk";

export const filterUserForClient = (user: User) => {
    return {
      id: user.id, 
      username: user.username, 
      profileImageUrl: user.profileImageUrl
    };
  };