const getMe = async (req) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const me = await jwt.verify(token, process.env.SECRET);
      return await models.User.findById(me.id).populate("roleId");
    } catch (e) {
      throw new AuthenticationError("Session Invalid or expired.");
    }
  }
};
export default getMe;
