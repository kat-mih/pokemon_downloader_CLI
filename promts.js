import inquirer from "inquirer";
import fs from "fs/promises";
import {
  fetchPokemon,
  createStats,
  downloadSprites,
  downloadArtwork,
  listOfRandomPokemons,
} from "./saving.js";
import chalk from "chalk";

// Pokemon name
const getPokemonName = async () => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "pokemon_name",
      message: "Pokemon name: ",
    },
  ]);
  const name = answer.pokemon_name;

  // Name validation
  if (!name.length) throw new Error();

  return name;
};

// Choose what data about pokemon to download
const dataToDownload = async (pokemonName, pokemonJson) => {
  const dataToDownload = await inquirer.prompt([
    {
      type: "checkbox",
      message: "Pokemon info to download",
      name: "information",
      choices: [
        {
          name: "Stats",
        },
        {
          name: "Sprites",
        },
        {
          name: "Artwork",
        },
      ],
    },
  ]);

  // Create folder
  if (dataToDownload.information.length) {
    try {
      await fs.mkdir(`${pokemonName}`);
    } catch (error) {
      console.log(
        chalk.red.bold(
          `Pokemon folder was updated.
Please look at ${chalk.bgRed.white(pokemonName + "/")}`
        )
      );
    }
  }

  // Data downloading
  for (const choice of dataToDownload.information) {
    if (choice === "Stats") {
      await createStats(pokemonName, pokemonJson);
    }
    if (choice === "Sprites") {
      await downloadSprites(pokemonName, pokemonJson);
    }
    if (choice === "Artwork") {
      await downloadArtwork(pokemonName, pokemonJson);
    }
  }
};

// Choose if want to get info about another one pokemon
const oneMorePokemon = async () => {
  return await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Would you like to search for another pokemon?",
      choices: ["yes", "no"],
    },
  ]);
};

// Execute Pokemon Downloader
const getPokemonInformation = async () => {
  while (true) {
    try {
      const pokemonName = await getPokemonName();
      const pokemonJson = await fetchPokemon(pokemonName);
      await dataToDownload(pokemonName, pokemonJson);
      const anotherPokemoon = await oneMorePokemon();
      if (anotherPokemoon.answer === "no") break;
    } catch {
      const pokemonList = await listOfRandomPokemons();
      console.log(
        chalk.red.bold(
          "Pokemon with provided name does not exist, please try again!"
        ),
        `\nYou can choose one of the following:${chalk.green(pokemonList)}`
      );
    }
  }
};

export { getPokemonInformation };
