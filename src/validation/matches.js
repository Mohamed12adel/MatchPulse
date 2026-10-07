import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),

    startTime: z.string().datetime(),
    endTime: z.string().datetime(),

    homeScore: z.coerce.number().int().nonnegative().optional(),

    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),

  awayScore: z.coerce.number().int().nonnegative(),
});
