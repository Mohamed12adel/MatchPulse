import express from "express";
import {
  createCommentary,
  listCommentary,
} from "../controllers/commentary.controller.js";

export const commentaryRouter = express.Router({ mergeParams: true });

commentaryRouter.route("/").get(listCommentary).post(createCommentary);
