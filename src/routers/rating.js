import express from "express";
import { getAllRating, addRating, updateRating, deleteRating, ratingDiversion } from "../controllers/rating";
import { authentication } from "../auth.js";

const router = new express.Router();

router.post("/create", authentication, addRating);

router.get("/getAllRating", authentication, getAllRating);

router.get("/ratingDiversion:movieId", authentication, ratingDiversion);

router.put("/update", authentication, updateRating);

router.delete("/delete:id", authentication, deleteRating);

export default router;
