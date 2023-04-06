import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

const movieSchema = mongoose.Schema(
  {
    name: { type: String, index: true },
    description: String,
    poster: String,
    genre: [String],
    totalRating: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    director: String,
    // OTTPlatForm: [String],
    year: String,
  },
  { timestamps: true }
);

movieSchema.plugin(mongoosePaginate);

export const Movie = mongoose.model("movie", movieSchema);

