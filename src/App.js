import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DebugTools from './dev/debug-tools';

import GameConstants from './game-constants';
import SystemConstants from './systems/system-constants';
import UserActionConstants from './actions/user-actions-constants';

import UserPanel from './renderers/user/user-panel';
import SystemsRenderer from './renderers/system/systems';

import NoPower from './renderers/no-power';
import EmergencyLighting from './renderers/emergency-lighting';
import WinScreen from './renderers/win-screen';

import SystemScrambler from './language/system-scrambler';

class App extends Component {
  constructor(props) {
    super(props);

    var gameTimerInterval = setInterval(() => {
      this.tick();
    }, 500);

    this.state = {
			logMessages: [
				"You find yourself on spaceship, far from home.",
				"There is a control panel in front of you.",
			],
			systems: this.initaliseSystems(),
			systemsUndiscovered: this.initaliseUndiscoveredSystems(),
			systemsDiscovered: new Set([
				SystemConstants.SYSTEMS.EMERGENCY_LIGHTING,
			]),
			systemsSelected: new Set([
				SystemConstants.SYSTEMS.EMERGENCY_LIGHTING,
			]),
			wordsUnlearned: this.initaliseWords(),
			wordsLearned: new Set([
				" ",
			]),
			wordsScrambled: this.initaliseScrambledWords(),
			lastKey: 1,
			gameTimerInterval: gameTimerInterval,
			userAction: UserActionConstants.NOTHING,
			timer: 0,
			distanceToHome: Math.floor(Math.random() * GameConstants.MAX_DISTANCE_TO_HOME),
			availablePower: 0,
			pathPlotted: 0,
			ftlCharge: 0,
			lightsOn: false,
			lightLumens: 1,
			emergencyLightsOn: false,
			emergencyLightLumens: 0,
		};
  }

	initaliseSystems = () => {
		var allSystems = new Map();
		for (var system of SystemConstants.ALL_SYSTEMS) {
      var damageValue = (system.key === SystemConstants.SYSTEMS.EMERGENCY_LIGHTING)
        ? 0.9
        : Math.floor(Math.random() * 100) / 100;
			var damagedSystem = Object.assign(Object.assign({}, system), {
				damage: damageValue,
			});
			allSystems.set(damagedSystem.key, damagedSystem);
		}
		return allSystems;
	}

  initaliseUndiscoveredSystems = () => {
		var allSystemNames = new Set();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			allSystemNames.add(system.key);
		}
		return allSystemNames;
	}

	getAllWords = () => {
		var allWords = new Set();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			var words = system.key.split(" ");
			for (var word of words) {
				allWords.add(word.toLowerCase());
			}
		}
		return allWords;
	}

	initaliseWords = () => {
		return this.getAllWords();
	}

	initaliseScrambledWords = () => {
		var scrambledWords = new Map();
		for (var word of this.getAllWords()) {
			scrambledWords.set(word, SystemScrambler.scramble(word));
		}
		return scrambledWords;
	}

	discoverNewSystem = () => {
		var undiscoveredSystemKeys = [...this.state.systemsUndiscovered.keys()];
		if (undiscoveredSystemKeys.length > 0) {
			var discoveredSystemKey = undiscoveredSystemKeys[Math.floor(Math.random() * undiscoveredSystemKeys.length)];

			this.setState((previousState, currentProps) => {
				var systemsUndiscovered = new Set(previousState.systemsUndiscovered);
				var systemsDiscovered = new Set(previousState.systemsDiscovered);
				systemsUndiscovered.delete(discoveredSystemKey);
				systemsDiscovered.add(discoveredSystemKey);
				return {
					systemsUndiscovered: systemsUndiscovered,
					systemsDiscovered: systemsDiscovered,
				};
			});
			//this.addLogMessage("You have discovered " + scrambledSystem.name + ", a new ship system.");
		}
	}

	learnNewWord = () => {
		var wordsUnlearned = [...this.state.wordsUnlearned.keys()];
		if (wordsUnlearned.length > 0) {
			var discoveredWord = wordsUnlearned[Math.floor(Math.random() * wordsUnlearned.length)];

			this.setState((previousState, currentProps) => {
				var wordsUnlearned = new Set(previousState.wordsUnlearned);
				var wordsLearned = new Set(previousState.wordsLearned);
				wordsUnlearned.delete(discoveredWord);
				wordsLearned.add(discoveredWord);
				return {
					wordsUnlearned: wordsUnlearned,
					wordsLearned: wordsLearned,
				};
			});
			this.addLogMessage("You have learned the ships word for \"" + discoveredWord + "\".");
		}
	}

	fullyUnscrambleSystemName = (system) => {
		if (this.state.systemsDiscovered.indexOf(system) > -1) {
			var unscrambledSystem = SystemScrambler.unscramble(system);

			this.setState((previousState, currentProps) => {
			    return {
					systemsDiscovered: [
						...previousState.systemsDiscovered.slice(0, previousState.systemsDiscovered.indexOf(system)),
						Object.assign(unscrambledSystem, {key: system.key}),
						...previousState.systemsDiscovered.slice(previousState.systemsDiscovered.indexOf(system) + 1)
					]
				};
			});
		}
	}

	addPower = (power) => {
		this.setState((previousState, currentProps) => {
			return {
				availablePower: Math.min(GameConstants.MAX_POWER, previousState.availablePower + power),
			};
		});
	}

	enableLights = () => {
		this.addLogMessage("System power restored.");
		this.setState((previousState, currentProps) => {
			return {
				lightsOn: true,
				emergencyLightsOn: false,
			};
		});
		var emergencyLightInterval = setInterval(() => {
			if (this.state.emergencyLightLumens > 0) {
				this.addEmergencyLumens(-0.01);
			}
			else {
				clearInterval(emergencyLightInterval);
			}
		}, 100);
		this.disableDarkness();
	}

	disableDarkness = () => {
		var darknessInterval = setInterval(() => {
			if (this.state.lightLumens > 0) {
				this.addLumens(-0.01);
			}
			else {
				clearInterval(darknessInterval);
			}
		}, 100);
	}

	addLumens = (lumens) => {
		this.setState((previousState, currentProps) => {
			return {
				lightLumens: Math.min(1, previousState.lightLumens + lumens),
			};
		});
	}

	enableEmergencyLights = () => {
		this.addLogMessage("Emergency lighting restored.");
		this.setState((previousState, currentProps) => {
			return {
				emergencyLightsOn: true,
			};
		});
		var emergencyLightInterval = setInterval(() => {
			if (this.state.emergencyLightLumens < 1) {
				this.addEmergencyLumens(0.01);
			}
			else {
				clearInterval(emergencyLightInterval);
			}
		}, 100);
		this.disableDarkness();
	}

	addEmergencyLumens = (lumens) => {
		this.setState((previousState, currentProps) => {
			return {
				emergencyLightLumens: Math.min(1, previousState.emergencyLightLumens + lumens),
			};
		});
	}

	addDistance = (distance) => {
		if (this.state.distanceToHome >= Math.abs(distance)) {
			this.setState((previousState, currentProps) => {
				return {
					distanceToHome: Math.max(0, previousState.distanceToHome + distance),
				};
			});
		}
	}

	addPath = (path) => {
		if (this.state.pathPlotted < 100 && this.state.pathPlotted % 25 == 0) {
			this.addLogMessage("FTL Travel Path " + this.state.pathPlotted + "% calculated.");
		}
		else if (this.state.pathPlotted == 99) {
			this.addLogMessage("FTL Travel Path fully calculated.");
		}
		this.setState((previousState, currentProps) => {
			return {
				pathPlotted: Math.min(GameConstants.MAX_PATH_TO_PLOT, previousState.pathPlotted + path),
			};
		});
	}

	addFtlCharge = (charge) => {
		if (this.state.ftlCharge < 100 && this.state.ftlCharge % 25 == 0) {
			this.addLogMessage("FTL Drive " + this.state.ftlCharge + "% charged.");
		}
		else if (this.state.ftlCharge == 99) {
			this.addLogMessage("FTL Drive fully charged.");
		}
		this.setState((previousState, currentProps) => {
			return {
				ftlCharge: Math.min(GameConstants.MAX_FTL_TO_CHARGE, previousState.ftlCharge + charge),
			};
		});
	}

	performFtlJump = () => {
		if (this.state.distanceToHome > GameConstants.FTL_JUMP_BUFFER_DISTANCE) {
			var distanceToJump = Math.floor(Math.random() * (this.state.distanceToHome - GameConstants.FTL_JUMP_BUFFER_DISTANCE));
			this.setState((previousState, currentProps) => {
				return {
					distanceToHome: Math.max(0, previousState.distanceToHome - distanceToJump),
					pathPlotted: 1,
					ftlCharge: 1,
				};
			});
			this.addLogMessage("FTL Jump complete, travelled " + distanceToJump + " light years.");
		}
		else {
			this.addLogMessage("Not safe to perform FTL Jump, too close to destination.");
		}
	}

	repairSystem = (systemKey, repairAmount) => {
		if (this.state.availablePower > 0) {
			var damagedSystem = this.state.systems.get(systemKey);
			if (damagedSystem.damage < 1) {
				var repairedSystem = Object.assign(Object.assign({}, damagedSystem), {
		            damage: damagedSystem.damage + repairAmount,
		        });
				this.setState((previousState, currentProps) => {
					var systems = new Map(previousState.systems);
					systems.set(systemKey, repairedSystem);
				    return {
						availablePower: previousState.availablePower - 1,
						systems: systems,
					};
				});
			}
		}
	}

	setUserAction = (userAction) => {
		this.setState((previousState, currentProps) => {
			return {
				userAction: userAction
			};
		});
	}

	selectSystem = (systemKey) => {
		if (!this.state.systemsSelected.has(systemKey)) {
			this.setState((previousState, currentProps) => {
				var systemsSelected = new Set(previousState.systemsSelected);
				systemsSelected.add(systemKey);
				return {
					systemsSelected: systemsSelected,
				};
			});
		}
	}

	deselectSystem = (systemKey) => {
		if (this.state.systemsSelected.has(systemKey)) {
			this.setState((previousState, currentProps) => {
				var systemsSelected = new Set(previousState.systemsSelected);
				systemsSelected.delete(systemKey);
				return {
					systemsSelected: systemsSelected,
				};
			});
		}
	}

	addLogMessage = (message) => {
		this.setState((previousState, currentProps) => {
			return {
				logMessages: [...previousState.logMessages, message],
			};
		});
	}

	// debug functions
	fullyUnscrambleAllSystems = () => {
		for (var system of this.state.systemsDiscovered) {
			this.fullyUnscrambleSystemName(system);
		}
	}

	isDebugMode = () => {
		return window.location.href.indexOf("debug") !== -1;
	}

	getSystemsDiscovered = () => {
		return [...this.state.systemsDiscovered].map(systemKey => {
			return this.state.systems.get(systemKey);
		});
	}

	allSystemsDiscovered = () => {
		return [...this.state.systemsUndiscovered.keys()].length <= 0;
	}

	allWordsLearned = () => {
		return [...this.state.wordsUnlearned.keys()].length <= 0;
	}

	ftlJumpReady = () => {
		return this.state.systems.get(SystemConstants.SYSTEMS.FTL_DRIVE).damage >= 1 && this.state.pathPlotted >= GameConstants.MAX_PATH_TO_PLOT && this.state.ftlCharge >= GameConstants.MAX_FTL_TO_CHARGE;
	}

	atMaxPower = () => {
		return this.state.availablePower >= GameConstants.MAX_POWER;
	}

	atZeroPower = () => {
		return this.state.availablePower <= 0;
	}

	attemptToDiscoverNewSystem = () => {
		if (Math.random() < GameConstants.SYSTEM_DISCOVERY_CHANCE) {
			this.discoverNewSystem();
		}
	}

	attemptToLearnNewWord = () => {
		if (Math.random() < GameConstants.LEARN_DISCOVERY_CHANCE) {
			this.learnNewWord();
		}
	}

	translate = (text) => {
		var words = text.split(" ");
		for (var i = 0; i < words.length; i++) {
			if (!this.state.wordsLearned.has(words[i].toLowerCase())) {
				words = [
					...words.slice(0, i),
					this.state.wordsScrambled.get(words[i].toLowerCase()),
					...words.slice(i + 1),
				];
			}
		}
		return words.join(" ");
	}

	repairSelectedSystems = () => {
		for (var systemKey of this.state.systemsSelected) {
			this.repairSystem(systemKey, UserActionConstants.REPAIR_PER_TICK);
		}
	}

	tickUserAction = () => {
		if (this.state.userAction == UserActionConstants.DISCOVER_SYSTEMS) {
			if (this.allSystemsDiscovered()) {
				this.addLogMessage("The are no systems left to discover.");
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.attemptToDiscoverNewSystem();
			}
		}
		else if (this.state.userAction == UserActionConstants.REPAIR_SYSTEMS) {
			if (this.atZeroPower()) {
				this.addLogMessage("Repairs have stopped due to lack of power.");
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.repairSelectedSystems();
			}
		}
		else if (this.state.userAction == UserActionConstants.LEARN_SHIP_LANGUAGE) {
			if (this.allWordsLearned()) {
				this.addLogMessage("The are no words left to learn.");
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.attemptToLearnNewWord();
			}
		}
		else if (this.state.userAction == UserActionConstants.GENERATE_POWER) {
			if (this.atMaxPower()) {
				this.addLogMessage("You have reached maximum available power.");
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.addPower(1);
			}
		}
	}

	tickSystemAction = () => {
		// free power
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.MAIN_POWER) && this.state.systems.get(SystemConstants.SYSTEMS.MAIN_POWER).damage >= 1) {
			this.addPower(2);
		}
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.AUXILIARY_POWER) && this.state.systems.get(SystemConstants.SYSTEMS.AUXILIARY_POWER).damage >= 1) {
			this.addPower(1);
		}
		// free translation
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.UNIVERSAL_TRANSLATOR) && this.state.systems.get(SystemConstants.SYSTEMS.UNIVERSAL_TRANSLATOR).damage >= 1) {
			this.attemptToLearnNewWord();
		}
		// free repairs
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.LARGE_SCALE_MANUFACTURING) && this.state.systems.get(SystemConstants.SYSTEMS.LARGE_SCALE_MANUFACTURING).damage >= 1) {
			this.repairSelectedSystems();
		}
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.SMALL_SCALE_MANUFACTURING) && this.state.systems.get(SystemConstants.SYSTEMS.SMALL_SCALE_MANUFACTURING).damage >= 1) {
			this.repairSelectedSystems();
		}
		// plot FTL path
		if (this.state.systems.get(SystemConstants.SYSTEMS.LONG_RANGE_SCANNERS).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.FTL_COMPUTER).damage >= 1) {
			this.addPath(1);
		}
		// charge FTL drive
		if (this.state.systems.get(SystemConstants.SYSTEMS.FTL_DRIVE).damage >= 1) {
			this.addFtlCharge(1);
		}
		// travel home
		if (this.state.systems.get(SystemConstants.SYSTEMS.MAIN_THRUSTERS).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.FUEL_REGULATION).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.HELM).damage >= 1) {
			this.addDistance(-GameConstants.MAIN_THRUSTERS_DISTANCE);
		}
		if (this.state.systems.get(SystemConstants.SYSTEMS.MANUVERING_THRUSTERS).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.FUEL_REGULATION).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.HELM).damage >= 1) {
			this.addDistance(-GameConstants.MANUVERING_THRUSTERS_DISTANCE);
		}
		// lights
		if (!this.noPower() && !this.state.lightsOn) {
			this.enableLights();
		}
		if (this.emergencyLighting() && !this.state.emergencyLightsOn) {
			this.enableEmergencyLights();
		}
	}

	tick = () => {
		this.tickUserAction();
		this.tickSystemAction();
		this.setState((previousState, currentProps) => {
			return {
				timer: previousState.timer + 1,
			};
		});
	}

	noPower = () => {
		return this.state.systems.get(SystemConstants.SYSTEMS.MAIN_POWER).damage < 1 && this.state.systems.get(SystemConstants.SYSTEMS.AUXILIARY_POWER).damage < 1
	}

	emergencyLighting = () => {
		return this.noPower() && this.state.systems.get(SystemConstants.SYSTEMS.EMERGENCY_LIGHTING).damage >= 1
	}

	noLights = () => {
		return this.noPower() && !this.emergencyLighting();
	}

	distanceVisible = () => {
		return this.state.systems.get(SystemConstants.SYSTEMS.LONG_RANGE_SCANNERS).damage >= 1
	}

	isWon = () => {
		return this.state.distanceToHome <= 0;
	}

	render = () => {
		return <div>
			{this.isDebugMode() && <DebugTools addSystem={this.discoverNewSystem} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />}
			{this.state.lightLumens > 0 && <NoPower lumens={this.state.lightLumens} />}
			{this.state.emergencyLightLumens > 0 && <EmergencyLighting lumens={this.state.emergencyLightLumens} />}
			<UserPanel userAction={this.state.userAction} setUserAction={this.setUserAction} allSystemsDiscovered={this.allSystemsDiscovered()} allWordsLearned={this.allWordsLearned()} fltJumpReady={this.ftlJumpReady()} performFtlJump={this.performFtlJump} timer={this.state.timer} distanceVisible={this.distanceVisible()} distanceToHome={this.state.distanceToHome} availablePower={this.state.availablePower} atMaxPower={this.atMaxPower()} atZeroPower={this.atZeroPower()} pathPlotted={this.state.pathPlotted} ftlCharge={this.state.ftlCharge} logMessages={this.state.logMessages} />
			<SystemsRenderer noLights={this.noLights()} systemsHighlighted={this.noPower() ? new Set([SystemConstants.SYSTEMS.EMERGENCY_LIGHTING]) : new Set()} systemsSelected={this.state.systemsSelected} selectSystem={this.selectSystem} deselectSystem={this.deselectSystem} translate={this.translate}>{this.getSystemsDiscovered()}</SystemsRenderer>
			{this.isWon() && <WinScreen />}
		</div>;
	}
}

export default App;
