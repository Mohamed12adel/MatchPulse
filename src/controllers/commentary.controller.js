import { db } from "../db/connect.js";
import { commentary } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";

const MAX_LIMIT = 100;

export const listCommentary = async (req, res) => {
  const parsedParams = matchIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid match parameters.",
      details: parsedParams.error.issues,
    });
  }

  const parsedQuery = listCommentaryQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(400).json({
      error: "Invalid query.",
      details: parsedQuery.error.issues,
    });
  }

  const limit = Math.min(parsedQuery.data.limit ?? MAX_LIMIT, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, parsedParams.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to list commentary." });
  }
};

export const createCommentary = async (req, res) => {
  const parsedParams = matchIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid match parameters.",
      details: parsedParams.error.issues,
    });
  }

  const parsedBody = createCommentarySchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid payload.",
      details: parsedBody.error.issues,
    });
  }

  const { minutes, ...commentaryData } = parsedBody.data;

  try {
    const [createdCommentary] = await db
      .insert(commentary)
      .values({
        matchId: parsedParams.data.id,
        minute: minutes,
        ...commentaryData,
      })
      .returning();

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(
        createdCommentary.matchId,
        createdCommentary,
      );
    }
    return res.status(201).json({ data: createdCommentary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create commentary." });
  }
};
