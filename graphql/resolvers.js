const mutations = require("./mutations");
const queries = require("./queries");
const typesResolvers = require("./typesResolver");

module.exports = {
  Query: queries,
  Mutation: mutations,
  ...typesResolvers
};
