//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./FantasyThings.sol";

abstract contract CampaignPlaymaster {

	uint256 immutable public numberOfTurns;
	mapping(uint256 => uint256) public playerTurn; //maps NFT token id to turn

	mapping(uint256 => FantasyThings.CampaignAttributes) public playerStatus;
	mapping(uint256 => mapping(FantasyThings.AbilityType => uint8)) characterPower; //this mapping is useful for dynamically selecting power for attacks and defends
	
	mapping(uint256 => FantasyThings.TurnType) public turnGuaranteedTypes;
	mapping(uint256 => mapping(uint256 => FantasyThings.TurnType)) public turnTypes;
	mapping(uint256 => FantasyThings.Mob) public mobAttributes; //mapping from an ID to mob attributes
	mapping(uint256 => mapping(uint256 => FantasyThings.Mob[])) public combatTurnToMobs; //we want to generate this dynamically with chainlinkVRF except at specific points
	mapping(uint256 => mapping(uint256 => uint256)) public turnNumMobsAlive; //player -> turn -> number of remaining mobs
	mapping(uint256 => bool) public turnInProgress; //tracks whether the player is in the middle of a turn or not

	event CampaignStarted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignCompleted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignAbandoned(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignFailed(address indexed _user, address indexed _campaign, uint256 _tokenId);

	event TurnStarted(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber, FantasyThings.TurnType);
	event TurnCompleted(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber, uint256 eventId, uint8 eventType, string eventName);
	event PlayerDied(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber, uint256 eventId, uint8 eventType, string eventName);
	event AttackedMob(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 damageDone, string abilityName, uint256 remainingMobHealth, bool stillAlive);

	IERC721Metadata public fantasyCharacters;

	constructor(uint256 _numberOfTurns, address _fantasyCharacters) {
		numberOfTurns = _numberOfTurns;
		fantasyCharacters = IERC721Metadata(_fantasyCharacters);
	}

	modifier controlsCharacter(uint256 _tokenId) {
		require(fantasyCharacters.ownerOf(_tokenId) == msg.sender, "You do not control this character");
		_;
	}

	modifier turnActive(uint256 _tokenId) {
		require(turnInProgress[_tokenId], "No turn in progress, generate a turn");
		_;
	}

	modifier isCombatTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Combat, "Cannot attack right now!");
		_;
	}

	modifier isCombatAbility(FantasyThings.Ability calldata _ability) {
		require(_ability.action == 1, "Not an attack ability");
		_;
	}

	modifier isLootTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Loot, "Nothing to loot!");
		_;
	}

	modifier isPuzzleTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Puzzle, "Not a puzzle!");
		_;
	}

	function getCurrentCampaignStats(uint256 _tokenId) external view returns(FantasyThings.CampaignAttributes memory) {
		return playerStatus[_tokenId];
	}
	
	function _setMob(uint16 _health, uint8[8] memory _stats, string memory _name, FantasyThings.Ability[] memory _abilities, uint256 _mobId) internal {
		FantasyThings.Mob storage mob = mobAttributes[_mobId];
		mob.strength = _stats[0];
		mob.armor = _stats[1];
		mob.physicalblock = _stats[2];
		mob.agility = _stats[3];
		mob.spellpower = _stats[4];
		mob.spellresistance = _stats[5];
		mob.healingpower = _stats[6];
		mob.spawnRate = _stats[7];
		mob.health = _health;
		mob.name = _name;
		for(uint i = 0; i < _abilities.length; i++) {
			mob.abilities.push(_abilities[i]);
		}
	}

	function _setMobsForTurn(uint256 _tokenId, uint256[] memory _mobIds) internal {
		for(uint256 i=0; i< _mobIds.length; i++) {
			combatTurnToMobs[_tokenId][playerTurn[_tokenId]].push(mobAttributes[_mobIds[i]]);
		}
	}

	function inspectMob(uint256 _mobId) public view returns(FantasyThings.Mob memory) {
		return mobAttributes[_mobId];
	}

	function inspectMobAbilities(uint256 _mobId) public view returns(FantasyThings.Ability[] memory) {
		return mobAttributes[_mobId].abilities;
	}

	function enterCampaign(uint256 _tokenId) external virtual;
	function _endCampaign(address _user, uint256 _tokenId) internal virtual;
	function generateTurn(uint256 _tokenId) external virtual;
	function attackWithAbility(uint256 _tokenId, FantasyThings.Ability calldata _userAbility, uint256 _target) external virtual;
	function attackWithItem(uint256 _tokenId, uint256 _itemId, uint256 _target) external virtual;
	function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex) internal virtual;
	

}