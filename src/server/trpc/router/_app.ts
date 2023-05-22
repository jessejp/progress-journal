import { router } from "../trpc";
import { authRouter } from "./auth";
import { chartsRouter } from "./charts";
import { entryRouter, fieldRouter } from "./entry";
import { subjectRouter } from "./subject";

export const appRouter = router({
  auth: authRouter,
  subject: subjectRouter,
  entry: entryRouter,
  field: fieldRouter,
  chart: chartsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
