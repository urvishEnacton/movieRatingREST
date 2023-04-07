import mongoose from "mongoose";
import models from "../models/index.js";

export const addRating = async (req, res) => {
  const input = req.body;
  const me = req?.me;
  input.userId = me?.id;
  input.gender = me?.gender;
  try {
    const movieData = await models.Movie.findById(input?.movieId);
    if (!movieData) throw new Error("Movie not found");
    const ratingData = await models.Rating.create(input);
    if (ratingData) {
      movieData.votes++;
      movieData.totalRating += input?.rate;
      movieData.rating = (movieData?.totalRating / movieData?.votes).toFixed(2);
      await movieData.save();
      res.status(200).send(ratingData);
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const ratingDiversion = async (req, res) => {
  const { movieId } = req.params;
  console.log("movieId: ", movieId);
  try {
    const rating = await models.Rating.aggregate([
      {
        $match: { movieId: new mongoose.Types.ObjectId(movieId) },
      },
      {
        $group: {
          _id: { x: "$rate" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$_id.x",
          count: "$count",
        },
      },
    ]);
    if (rating) {
      res.status(200).send({ data: rating });
    } else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getAllRating = async (req, res) => {
  const args = req?.body;
  const filterText = FilterQuery(args?.search, "ratingTable");
  let filter = JSON.parse(args?.filter);
  // const sort = [
  //   ["vote", -1],
  //   ["rating", -1],
  // ];
  const sort = { [args?.sort?.key]: args?.sort?.type };
  const option = {
    page: args?.page,
    limit: args?.limit,
    sort,
    populate: [],
  };
  console.log("option: ", option);
  try {
    filter = { ...filter, ...filterText };
    if (args?.top || args?.worst) filter = { ...filter, votes: { $gte: 500 } };
    const rating = await models.Rating.paginate(filter);
    if (rating.length > 0) {
      res.status(200).send({ data: rating });
    } else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateRating = async (req, res) => {
  const input = req.body;
  const me = req?.me;
  try {
    const rating = await models.Rating.findOne({ _id: input?.id, userId: me?.id });
    if (rating) {
      const movieData = await models.Movie.findById(rating.movieId);
      movieData.totalRating -= rating?.rate || 0;
      movieData.totalRating += input?.rate || 0;
      movieData.rating = (movieData?.totalRating / movieData.votes).toFixed(2);
      await movieData.save();
      rating.rate = input?.rate;
      await rating.save();
      res.status(200).send({ data: rating });
    } else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);
  const me = req?.me;
  try {
    const rating = await models.Rating.findOneAndRemove({ _id: id, userId: me?.id });
    console.log("rating: ", rating);
    // console.log("rating: ", rating);
    if (rating) {
      const movieData = await models.Movie.findById(rating.movieId);
      movieData.totalRating -= rating?.rate || 0;
      movieData.votes--;
      movieData.rating = (movieData?.totalRating / movieData.votes).toFixed(2);
      await movieData.save();

      res.status(200).send(true);
    } else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// 9624340807
