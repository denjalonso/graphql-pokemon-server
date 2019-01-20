const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const pokemons = require('./pokemons');

const typeDefs = fs.readFileSync(`${__dirname}/schema.graphql`, 'utf-8');

const resolvers = {
  Query: {
    pokemons: (_, args) => pokemons.slice(args.offset || 0, (args.offset || 0) + args.limit),
    pokemonById: (_, args) => pokemons.find(pokemon => pokemon.id === args.id),
    pokemonByName: (_, args ) => pokemons.find(pokemon => pokemon.name.toLowerCase() === args.name.toLowerCase())
  },
  Pokemon: {
    number: pokemon => parseInt(pokemon.id, 10),
    image: pokemon => `https://img.pokemondb.net/artwork/${pokemon.name.toLowerCase().replace(/[&\\/\\\\#,+()$~%.'":*?<>{}]/g, '').replace(' ', '-')}.jpg`,
    evolutions: pokemon => pokemon.evolutions || []
  },
  PokemonAttack: {
    fast: pokemonAttack => pokemonAttack.fast || [],
    special: pokemonAttack => pokemonAttack.special || []
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Pokemon GraphQL server running at ${url}`);
});
