import express from "express";
import {
  createMatch,
  getAllMatches,
} from "../controllers/matches.controller.js";

export const matchesRouter = express.Router();

matchesRouter.route("/").get(getAllMatches).post(createMatch);
