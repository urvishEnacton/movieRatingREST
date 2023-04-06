import models from "../models";
const jwt = require("jsonwebtoken");

const getUserFromToken = async (req) => {
  console.log('-----getUserFromToken----', );

  const token = req.headers["x-token"];
  if (!token) throw new Error("Session Invalid or expired. ");
  const me = await jwt.verify(token, process.env.SECRET);
  const user = await models.User.findById(me.id);
  if (!user) throw new Error("Session Invalid or expired. ");
  return user;
};

export const authentication = async (req, res, next) => {
  console.log('-----authentication----', );
  try {
    req.me = await getUserFromToken(req);
    return next();
  } catch (e) {
    return res.status(401).send({ error: e.message });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);
    if (user.userType !== "Admin") throw new Error("You are not Admin");
    req.me = user;
    return next();
  } catch (e) {
    return res.status(401).send({ error: error.message });
  }
};

// const token = req.headers["x-token"];
// if (token) {
//   try {
//     const me = await jwt.verify(token, process.env.SECRET);
//     return await models.User.findById(me.id).populate("roleId");
//   } catch (e) {
//     throw new AuthenticationError("Session Invalid or expired.");
//   }
// }
// };
