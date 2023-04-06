const Tables = {
  userTable: ["firstName", "lastName", "email"],
  movieTable: ["name"],
};

export const FilterQuery = (filterString, tableKey) => {
  if (filterString && filterString?.length > 0) {
    const keys = Tables[tableKey];
    const syntax = [];
    keys.forEach((ele) => {
      syntax.push({ [ele]: { $regex: filterString, $options: "i" } });
    });
    return { $or: syntax };
  } else {
    return {};
  }
};
