import { router } from "../trpc";
import { authRouter } from "./auth";
import { entryRouter } from "./entry";
import { subjectRouter } from "./subject";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  entry: entryRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
