import { type User } from "@clerk/nextjs/dist/server/clerk";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import zod from 'zod';

const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    profileImageUrl: user.profileImageUrl
  };
};

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: "@upstash/ratelimit",
});


export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    });

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100 
    })

    const filteredUsers = users.map(filterUserForClient);

    return posts.map((post) => {
      const author = filteredUsers.find((user) => user.id === post.authorId);

      if (!author || !author.username) {
        throw new TRPCError({
          code : 'INTERNAL_SERVER_ERROR', 
          message: 'User was not found'
        });
      }

      return {
        post,
        author: {
          ...author,
          username: author.username
        },
      }
    });
  }),
  create: privateProcedure
    .input(
      zod.object({
        content: zod.string().min(1).max(280)
      })
    )
    .mutation(async ({ctx, input}) => {
      const authorId = ctx.userId;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content
        }
      });

      return post;
  }),
});
