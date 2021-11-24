import { useCallback, useEffect, useRef } from "react";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import { ethers } from "ethers";
import { useGameData } from "./useGameData";
import { useWallet } from "./useWallet";

// enum Events {
//   CampaignStarted = "CampaignStarted",
//   CampaignEnded = "CampaignEnded",
//   TurnSet = "TurnSet",
//   TurnStarted = "TurnStarted",
//   TurnCompleted = "TurnCompleted",
//   CombatSequence = "CombatSequence",
// }

// const contractMock = {
//   on(...args: any[]) {
//     //
//   },
//   removeAllListeners(...args: any[]) {
//     //
//   },
// };

export const useContractListeners = () => {
  const [gameState] = useGameData();
  const { signer } = useWallet();
  if (!signer) {
    return;
  }
  const campaignAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const contract = new ethers.Contract(
    campaignAddress,
    CastleCampaign.abi,
    signer
  );
  const filterStarted = contract.filters.CampaignStarted(
    gameState.selectedTokenId
  );
  const filterEnded = contract.filters.CampaignEnded(gameState.selectedTokenId);
  const filterTurnSet = contract.filters.TurnSet(gameState.selectedTokenId);
  const filterTurnStart = contract.filters.TurnStarted(
    gameState.selectedTokenId
  );
  const filterTurnCompleted = contract.filters.TurnCompleted(
    gameState.selectedTokenId
  );
  const filterCombat = contract.filters.CombatSequence(
    gameState.selectedTokenId
  );
  const campaignStartedListener = useCallback(tokenId => {
    //
  }, []);
  const campaignEndedListener = useCallback((tokenId, successful) => {
    //
  }, []);
  const turnSetListener = useCallback(tokenId => {
    //
  }, []);
  const turnStartedListener = useCallback(tokenId => {
    //
  }, []);
  const turnCompletedListener = useCallback(tokenId => {
    //
  }, []);
  const combatListener = useCallback((tokenId, damageDone) => {
    //
  }, []);

  useEffect(() => {
    contract.on(filterStarted, campaignStartedListener);
    contract.on(filterEnded, campaignEndedListener);
    contract.on(filterTurnSet, turnSetListener);
    contract.on(filterTurnStart, turnStartedListener);
    contract.on(filterTurnCompleted, turnCompletedListener);
    contract.on(filterCombat, combatListener);
    return () => {
      contract.removeAllListeners(); //no event provided unsubscribes for all events
    };
  }, []);
};
