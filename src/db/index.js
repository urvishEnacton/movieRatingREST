import mongoose from "mongoose";
import models from "../models";
import { movieData } from "../utils/movieData.js";

console.log('process.env.DATABASE_URL: ', process.env.DATABASE_URL);
export const connectDB = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const preDefinedData = () => {
  addAdmin();
  addMovieData();
};

const addAdmin = async () => {
  const match = await models.User.findOne({ email: process.env.EMAIL });
  if (!match) {
    models.User.create({ email: process.env.EMAIL, password: process.env.PASSWORD, userType: "Admin", isVerified: true });
  }
};
const addMovieData = async () => {
  const count = await models.Movie.countDocuments();
  if (count <= 0) {
    models.Movie.create(movieData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    console.log("data: ", movieData);
  }
};
