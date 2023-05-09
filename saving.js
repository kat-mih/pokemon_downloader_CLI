import fs from "fs/promises";

// Get information about chosen pokemon
const fetchPokemon = async (pokemonName) => {
  const pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  const pokemonJson = await pokemon.json();
  return pokemonJson;
};

// Download stats about pokemon
const createStats = (pokemonName, pokemonJson) => {
  let stats = "";
  for (const ability of pokemonJson.stats) {
    stats += `${[ability.stat.name]}: ${ability.base_stat}\n`;
  }
  const filePath = `${pokemonName}/stats.txt`;
  fs.writeFile(filePath, stats);
  console.log(`Saved: ${filePath}`);
};

// Download all sprites images
const downloadSprites = async (pokemonName, pokemonJson) => {
  const sprites = pokemonJson.sprites;
  for (const sprite in sprites) {
    if (typeof sprites[sprite] === "string") {
      const spritePath = sprites[sprite];
      const fetchSprite = await fetch(spritePath);
      const buffer = Buffer.from(await fetchSprite.arrayBuffer());
      const filePath = `${pokemonName}/${sprite}.png`;
      fs.writeFile(filePath, buffer);
      console.log(`Saved: ${filePath}`);
    }
  }
};

// Download official artwork
const downloadArtwork = async (pokemonName, pokemonJson) => {
  const offArtworkPath =
    pokemonJson.sprites.other["official-artwork"].front_default;
  const fetchImage = await fetch(offArtworkPath);
  const buffer = Buffer.from(await fetchImage.arrayBuffer());
  const filePath = `${pokemonName}/official_artwork.png`;
  fs.writeFile(filePath, buffer);
  console.log(`Saved: ${filePath}`);
};

// Generate list of random pokemons (5)
const listOfRandomPokemons = async () => {
  const pokemonList = [];
  for (let i = 0; i < 5; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const pokemons = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomNum}`
    );
    const pokemonName = await pokemons.json();
    pokemonList.push(` ${pokemonName.name}`);
  }
  return pokemonList;
};

export {
  fetchPokemon,
  createStats,
  downloadSprites,
  downloadArtwork,
  listOfRandomPokemons,
};
