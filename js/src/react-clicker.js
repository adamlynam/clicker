var React = require('react');
var ReactDOM = require('react-dom');

var DebugTools = require('./dev/debug-tools');

var GameConstants = require('./game-constants');
var SystemConstants = require('./systems/system-constants');
var UserActionConstants = require('./actions/user-actions-constants');

var UserPanel = require('./renderers/user/user-panel');
var SystemsRenderer = require('./renderers/system/systems');

var NoPower = require('./renderers/no-power');
var EmergencyLighting = require('./renderers/emergency-lighting');
var WinScreen = require('./renderers/win-screen');

var SystemScrambler = require('./language/system-scrambler');

var Clicker = React.createClass({
	getInitialState: function() {
		var gameTimerInterval = setInterval(() => {
			this.tick();
		}, 500);

		return {
			logMessages: [
				"You find yourself on spaceship, far from home.",
				"There is a control panel in front of you.",
			],
			systems: this.initaliseSystems(),
			systemsUndiscovered: this.initaliseUndiscoveredSystems(),
			systemsDiscovered: new Map([
				[SystemConstants.SYSTEMS.EMERGENCY_LIGHTING, true],
			]),
			systemsSelected: new Map(),
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
			lightsOn: false,
			lightLumens: 1,
			emergencyLightsOn: false,
			emergencyLightLumens: 0,
		};
	},
	initaliseSystems: function() {
		var allSystems = new Map();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			var scrambledSystem = Object.assign(Object.assign({}, system), {
				damage: Math.floor(Math.random() * 100) / 100,
			});
			allSystems.set(scrambledSystem.key, scrambledSystem);
		}
		return allSystems;
	},
	initaliseUndiscoveredSystems: function() {
		var allSystemNames = new Map();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			allSystemNames.set(system.key, true);
		}
		return allSystemNames;
	},
	getAllWords: function() {
		var allWords = new Set();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			var words = system.key.split(" ");
			for (var word of words) {
				allWords.add(word.toLowerCase());
			}
		}
		return allWords;
	},
	initaliseWords: function() {
		return this.getAllWords();
	},
	initaliseScrambledWords: function() {
		var scrambledWords = new Map();
		for (var word of this.getAllWords()) {
			scrambledWords.set(word, SystemScrambler.scramble(word));
		}
		return scrambledWords;
	},
	discoverNewSystem: function() {
		var undiscoveredSystemKeys = [...this.state.systemsUndiscovered.keys()];
		if (undiscoveredSystemKeys.length > 0) {
			var discoveredSystemKey = undiscoveredSystemKeys[Math.floor(Math.random() * undiscoveredSystemKeys.length)];

			this.setState((previousState, currentProps) => {
				var systemsUndiscovered = new Map(previousState.systemsUndiscovered);
				var systemsDiscovered = new Map(previousState.systemsDiscovered);
				systemsUndiscovered.delete(discoveredSystemKey);
				systemsDiscovered.set(discoveredSystemKey, true);
				return {
					systemsUndiscovered: systemsUndiscovered,
					systemsDiscovered: systemsDiscovered,
				};
			});
			//this.addLogMessage("You have discovered " + scrambledSystem.name + ", a new ship system.");
		}
	},
	learnNewWord: function() {
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
	},
	fullyUnscrambleSystemName: function(system) {
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
	},
	addPower: function(power) {
		this.setState((previousState, currentProps) => {
			return {
				availablePower: Math.min(GameConstants.MAX_POWER, previousState.availablePower + power),
			};
		});
	},
	enableLights: function() {
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
	},
	disableDarkness: function() {
		var darknessInterval = setInterval(() => {
			if (this.state.lightLumens > 0) {
				this.addLumens(-0.01);
			}
			else {
				clearInterval(darknessInterval);
			}
		}, 100);
	},
	addLumens: function(lumens) {
		this.setState((previousState, currentProps) => {
			return {
				lightLumens: Math.min(1, previousState.lightLumens + lumens),
			};
		});
	},
	enableEmergencyLights: function() {
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
	},
	addEmergencyLumens: function(lumens) {
		this.setState((previousState, currentProps) => {
			return {
				emergencyLightLumens: Math.min(1, previousState.emergencyLightLumens + lumens),
			};
		});
	},
	addDistance: function(distance) {
		if (this.state.distanceToHome >= Math.abs(distance)) {
			this.setState((previousState, currentProps) => {
				return {
					distanceToHome: Math.max(0, previousState.distanceToHome + distance),
				};
			});
		}
	},
	addPath: function(path) {
		this.setState((previousState, currentProps) => {
			if (previousState.pathPlotted < 100 && previousState.pathPlotted % 25 == 0) {
				this.addLogMessage("FTL Travel Path " + previousState.pathPlotted + "% calculated.");
			}
			else if (previousState.pathPlotted == 99) {
				this.addLogMessage("FTL Travel Path fully calculated.");
			}
			return {
				pathPlotted: Math.min(GameConstants.MAX_PATH_TO_PLOT, previousState.pathPlotted + path),
			};
		});
	},
	repairSystem: function(systemKey, repairAmount) {
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
	},
	setUserAction: function(userAction) {
		this.setState((previousState, currentProps) => {
			return {
				userAction: userAction
			};
		});
	},
	selectSystem: function(systemKey) {
		if (!this.state.systemsSelected.has(systemKey)) {
			this.setState((previousState, currentProps) => {
				var systemsSelected = new Map(previousState.systemsSelected);
				systemsSelected.set(systemKey, true);
				return {
					systemsSelected: systemsSelected,
				};
			});
		}
	},
	deselectSystem: function(systemKey) {
		if (this.state.systemsSelected.has(systemKey)) {
			this.setState((previousState, currentProps) => {
				var systemsSelected = new Map(previousState.systemsSelected);
				systemsSelected.delete(systemKey);
				return {
					systemsSelected: systemsSelected,
				};
			});
		}
	},
	addLogMessage: function(message) {
		this.setState((previousState, currentProps) => {
			return {
				logMessages: [...previousState.logMessages, message],
			};
		});
	},

	// debug functions
	fullyUnscrambleAllSystems: function() {
		for (var system of this.state.systemsDiscovered) {
			this.fullyUnscrambleSystemName(system);
		}
	},
	isDebugMode: function() {
		return window.location.href.indexOf("debug") !== -1;
	},

	getSystemsDiscovered: function() {
		return [...this.state.systemsDiscovered.keys()].map(systemKey => {
			return this.state.systems.get(systemKey);
		});
	},
	allSystemsDiscovered: function() {
		return [...this.state.systemsUndiscovered.keys()].length <= 0;
	},
	allWordsLearned: function() {
		return [...this.state.wordsUnlearned.keys()].length <= 0;
	},
	atMaxPower: function() {
		return this.state.availablePower >= GameConstants.MAX_POWER;
	},
	atZeroPower: function() {
		return this.state.availablePower <= 0;
	},
	attemptToDiscoverNewSystem: function() {
		if (Math.random() < GameConstants.SYSTEM_DISCOVERY_CHANCE) {
			this.discoverNewSystem();
		}
	},
	attemptToLearnNewWord: function() {
		if (Math.random() < GameConstants.LEARN_DISCOVERY_CHANCE) {
			this.learnNewWord();
		}
	},
	translate: function(text) {
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
	},
	repairSelectedSystems: function() {
		for (var [systemKey,value] of this.state.systemsSelected) {
			this.repairSystem(systemKey, UserActionConstants.REPAIR_PER_TICK);
		}
	},

	tickUserAction: function() {
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
	},
	tickSystemAction: function() {
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
		// travel home
		if (this.state.systems.get(SystemConstants.SYSTEMS.FTL_DRIVE).damage >= 1 && this.state.pathPlotted >= GameConstants.MAX_PATH_TO_PLOT) {
			this.addDistance(-10000);
		}
		if (this.state.systems.get(SystemConstants.SYSTEMS.MAIN_THRUSTERS).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.FUEL_REGULATION).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.HELM).damage >= 1) {
			this.addDistance(-100);
		}
		if (this.state.systems.get(SystemConstants.SYSTEMS.MANUVERING_THRUSTERS).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.FUEL_REGULATION).damage >= 1 && this.state.systems.get(SystemConstants.SYSTEMS.HELM).damage >= 1) {
			this.addDistance(-1);
		}
		// lights
		if (!this.noPower() && !this.state.lightsOn) {
			this.enableLights();
		}
		if (this.emergencyLighting() && !this.state.emergencyLightsOn) {
			this.enableEmergencyLights();
		}
	},
	tick: function() {
		this.tickUserAction();
		this.tickSystemAction();
		this.setState((previousState, currentProps) => {
			return {
				timer: previousState.timer + 1,
			};
		});
	},
	noPower: function() {
		return this.state.systems.get(SystemConstants.SYSTEMS.MAIN_POWER).damage < 1 && this.state.systems.get(SystemConstants.SYSTEMS.AUXILIARY_POWER).damage < 1
	},
	emergencyLighting: function() {
		return this.noPower() && this.state.systems.get(SystemConstants.SYSTEMS.EMERGENCY_LIGHTING).damage >= 1
	},
	noLights: function() {
		return this.noPower() && !this.emergencyLighting();
	},
	distanceVisible: function() {
		return this.state.systems.get(SystemConstants.SYSTEMS.LONG_RANGE_SCANNERS).damage >= 1
	},
	isWon: function() {
		return this.state.distanceToHome <= 0;
	},

	render: function() {
		return <div>
			{this.isDebugMode() && <DebugTools addSystem={this.discoverNewSystem} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />}
			{this.state.lightLumens > 0 && <NoPower lumens={this.state.lightLumens} />}
			{this.state.emergencyLightLumens > 0 && <EmergencyLighting lumens={this.state.emergencyLightLumens} />}
			<UserPanel userAction={this.state.userAction} setUserAction={this.setUserAction} allSystemsDiscovered={this.allSystemsDiscovered()} allWordsLearned={this.allWordsLearned()} timer={this.state.timer} distanceVisible={this.distanceVisible()} distanceToHome={this.state.distanceToHome} availablePower={this.state.availablePower} atMaxPower={this.atMaxPower()} atZeroPower={this.atZeroPower()} pathPlotted={this.state.pathPlotted} logMessages={this.state.logMessages} />
			<SystemsRenderer noLights={this.noLights()} systemsHighlighted={this.noPower() ? new Map([[SystemConstants.SYSTEMS.EMERGENCY_LIGHTING, true]]) : new Map()} systemsSelected={this.state.systemsSelected} selectSystem={this.selectSystem} deselectSystem={this.deselectSystem} translate={this.translate}>{this.getSystemsDiscovered()}</SystemsRenderer>
			{this.isWon() && <WinScreen />}
		</div>;
	}
});

ReactDOM.render(
	<Clicker />,
	document.getElementById('content')
);
