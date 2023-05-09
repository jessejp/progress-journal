import { router } from "../trpc";
import { authRouter } from "./auth";
import { entryRouter, fieldRouter } from "./entry";
import { subjectRouter } from "./subject";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  entry: entryRouter,
  field: fieldRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
