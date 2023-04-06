import models from "../models/index.js";

export const addMovie = async (req, res) => {
  const input = req.body;
  try {
    await models.Movie.create(input, (err, result) => {
      if (err) throw err;
      else res.status(200).send(result);
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getAllMovie = async (req, res) => {
  const args = req?.body;
  const filterText = FilterQuery(args?.search, "movieTable");
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
    const movie = await models.Movie.paginate(filter);
    if (movie.length > 0) {
      res.status(200).send({ data: movie });
    } else res.status(404).send({ error: "No movie found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  const input = req.body;
  try {
    const movie = await models.Movie.findOneAndUpdate({ _id: input?.id }, input, { new: true });

    if (movie) res.status(200).send({ data: movie });
    else res.status(404).send({ error: "No movie found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  const id = req.parse;
  try {
    const movie = models.Movie.findByIdAndRemove(id);
    if (movie) res.status(200).send(true);
    else res.status(404).send({ error: "No movie found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
