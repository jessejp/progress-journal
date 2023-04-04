import { router } from "../trpc";
import { authRouter } from "./auth";
import { subjectRouter } from "./subject";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  subject: subjectRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
