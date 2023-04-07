import express from "express";
import { getAllMovie, addMovie, updateMovie, deleteMovie } from "../controllers/movie";
import { authentication, adminAuth } from "../auth.js";

const router = new express.Router();

router.post("/create", adminAuth, addMovie);

router.get("/getAllMovie", authentication, getAllMovie);

router.put("/update", adminAuth, updateMovie);

router.delete("/delete:id", adminAuth, deleteMovie);

export default router;
