const { types } = require('../consts');

module.exports = function createHandler(fn) {
  return async function handler(user, type = types.ANIME) {
    if (!user) {
      return { items: [], error: 'Username is required.' };
    }

    try {
      const { items, error } = await fn(user, type);

      return { items, error };
    } catch (error) {
      console.error(error);
      return {
        items: [],
        error: `Something went wrong and your request could not be completed.`
      };
    }
  };
};
