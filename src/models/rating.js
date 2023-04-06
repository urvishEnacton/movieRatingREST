import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const ObjectId = mongoose.Schema.Types.ObjectId;
const ratingSchema = mongoose.Schema(
  {
    movieId: {
        type: ObjectId,
        ref: "movie",
      },
    userId: {
      type: ObjectId,
      ref: "user",
    },
    ageGroup: String,
    rate: Number,
    gender: String,
  },
  { timestamps: true }
);

ratingSchema.plugin(mongoosePaginate);

export const Rating = mongoose.model("rating", ratingSchema);
