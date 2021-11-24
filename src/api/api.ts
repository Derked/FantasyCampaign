import { BigNumber, ethers } from "ethers";
import { CharacterStatsDictionary } from "../types";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import FantasyAttributesManager from "../../artifacts/contracts/FantasyAttributesManager.sol/FantasyAttributesManager.json";

import Web3Modal from "web3modal";
import { characterStats } from "../constants";
import { CharacterAttributesStructOutput } from "../../typechain/FantasyAttributesManager";

// --------------------------------------------------------------------------------

export const fetchAllMintedCharacters = async (
  signer: JsonRpcSigner | undefined
): Promise<CharacterStatsDictionary | null> => {
  if (!signer) {
    return null;
  }
  const address = await signer.getAddress();
  const fantasyCharacterContract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    FantasyCharacter.abi,
    signer
  );
  const rawTokenIds: BigNumber[] =
    await fantasyCharacterContract.getAllCharacters(address);
  const tokenIds = rawTokenIds.map(id => id.toNumber());
  const attributesManagerContract = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    FantasyAttributesManager.abi,
    signer
  );
  const characterMap: CharacterStatsDictionary = {};
  const promises = tokenIds.map(async tokenId => {
    const character: CharacterAttributesStructOutput =
      await attributesManagerContract.getPlayer(tokenId);
    const {
      health,
      strength,
      armor,
      physicalblock,
      agility,
      spellpower,
      spellresistance,
      healingpower,
      class: id,
    } = character;
    characterMap[id] = {
      name: characterStats[id]?.name || "Unknown",
      health,
      strength,
      armor,
      block: physicalblock,
      agility,
      spellPower: spellpower,
      spellResistance: spellresistance,
      healingPower: healingpower,
      tokenId,
      id,
    };
  });
  await Promise.all(promises);
  return characterMap;
};
export const FETCH_MINTED_CACHE_KEY = "allMintedCharacters";

// --------------------------------------------------------------------------------

export const createCharacter = async (
  signer: JsonRpcSigner | undefined,
  characterId: number | null
) => {
  if (!signer) {
    return null;
  }
  if (!signer) {
    return null;
  }
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    FantasyCharacter.abi,
    signer
  );
  const transaction = await contract.createCharacter(characterId);
  await transaction.wait();
};
export const CREATE_CHARACTER_CACHE_KEY = "createCharacter";

// --------------------------------------------------------------------------------

export const enterCampaign = async (
  signer: JsonRpcSigner | undefined,
  characterToken: number
) => {
  if (!signer) {
    return null;
  }
  const contract = new ethers.Contract(
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    CastleCampaign.abi,
    signer
  );
  const turn = await contract.playerTurn(characterToken);
  const turnNumber = turn.toNumber();
  if (turnNumber === 0) {
    await contract.enterCampaign(characterToken);
  }
};
export const ENTER_CAMPAIGN_CACHE_KEY = "enterCampaign";

// --------------------------------------------------------------------------------

export const generateTurn = async (
  signer: JsonRpcSigner | undefined,
  characterToken: number
) => {
  if (!signer) {
    return null;
  }
  const contract = new ethers.Contract(
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    CastleCampaign.abi,
    signer
  );
  await contract.generateTurn(characterToken);
};
export const GENERATE_TURN_CACHE_KEY = "generateTurn";

// --------------------------------------------------------------------------------

export const fetchSigner = async (): Promise<JsonRpcSigner> => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signerResponse = provider.getSigner();
  return signerResponse;
};
export const FETCH_SIGNER_CACHE_KEY = "fetchSigner";