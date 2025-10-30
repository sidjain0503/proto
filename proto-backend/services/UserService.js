const { getAll } = require("../data/operations/get");

const getAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allusers = await getAll("user", { active: 1 });

      resolve({
        code: 200,
        data: allusers,
      });
    } catch (err) {
      return reject({
        code: 500,
        error: err,
      });
    }
  });
};

module.exports = {
  getAllUsers,
};
