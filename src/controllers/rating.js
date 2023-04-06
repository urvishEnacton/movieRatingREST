import mongoose from "mongoose";
import models from "../models/index.js";

export const addRating = async (req, res) => {
  const input = req.body;
  const me = req?.me;
  input.userId = me?.id;
  input.gender = me?.gender;
  try {
    await models.Rating.create(input, async (err, result) => {
      if (err) throw err;
      else {
        const movieData = await models.Movie.findById(res.movieId);
        movieData.votes++;
        movieData.totalRating += input?.rate;
        movieData.rating = (movieData?.totalRating / movieData.votes).toFixed(2);
        console.log("movieData: ", movieData);
        await movieData.save();
        console.log("movieData: ", movieData);

        res.status(200).send(result);
      }
    });
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
    const rating = await models.Rating.findOneAndUpdate({ id: input?.id, userId: me?.id }, input);
    if (rating) {
      const movieData = await models.Movie.findById(rating.movieId);
      movieData.totalRating -= res?.rate;
      movieData.totalRating += input?.rate;
      movieData.rating = (movieData?.totalRating / movieData.votes).toFixed(2);
      console.log("movieData: ", movieData);
      await movieData.save();
      console.log("movieData: ", movieData);
      res.status(200).send({ data: rating });
    } else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  const { id } = req.params;
  const me = req?.me;
  try {
    const rating = await models.Rating.findOneAndDelete({ id, userId: me?.id });
    console.log("rating: ", rating);
    if (rating) res.status(200).send(true);
    else res.status(404).send({ error: "No rating found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
