var React = require('react');
var ReactDOM = require('react-dom');

var DebugTools = require('./dev/debug-tools');

var SystemConstants = require('./systems/system-constants');
var UserActionConstants = require('./actions/user-actions-constants');

var UserPanel = require('./renderers/user/user-panel');
var SystemsRenderer = require('./renderers/system/systems');
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
			systemsDiscovered: new Map(),
			systemsSelected: new Map(),
			lastKey: 1,
			gameTimerInterval: gameTimerInterval,
			userAction: UserActionConstants.NOTHING,
			timer: 0,
			availablePower: 0,
			pathPlotted: 0,
		};
	},
	initaliseSystems: function() {
		var allSystems = new Map();
		for (var system of SystemConstants.ALL_SYSTEMS) {
			var scrambledSystem = Object.assign(Object.assign({}, system), {
		        name: SystemScrambler.scramble(system.key),
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
	decodeSystemName: function(system) {
		var decodedSystem = Object.assign(Object.assign({}, system), {
			name: SystemScrambler.decodeStep(system.name, system.key),
		});

		this.setState((previousState, currentProps) => {
			var systems = new Map(previousState.systems);
			systems.set(system.key, decodedSystem);
			return {
				systems: systems,
			};
		});
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
				availablePower: Math.min(SystemConstants.MAX_POWER, previousState.availablePower + power),
			};
		});
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
				pathPlotted: Math.min(SystemConstants.MAX_PATH_TO_PLOT, previousState.pathPlotted + path),
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
	decodeAllSystems: function() {
		for (var [systemKey, system] of this.state.systems) {
			this.decodeSystemName(system);
		}
	},
	allSystemsDiscovered: function() {
		return [...this.state.systemsDiscovered.keys()].length >= SystemConstants.ALL_SYSTEMS.length;
	},
	atMaxPower: function() {
		return this.state.availablePower >= SystemConstants.MAX_POWER;
	},
	atZeroPower: function() {
		return this.state.availablePower <= 0;
	},
	attemptToDiscoverNewSystem: function() {
		if (Math.random() < SystemConstants.SYSTEM_DISCOVERY_CHANCE) {
			this.discoverNewSystem();
		}
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
			this.decodeAllSystems();
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
			this.decodeAllSystems();
		}
		// free repairs
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.LARGE_SCALE_MANUFACTURING) && this.state.systems.get(SystemConstants.SYSTEMS.LARGE_SCALE_MANUFACTURING).damage >= 1) {
			this.repairSelectedSystems();
		}
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.SMALL_SCALE_MANUFACTURING) && this.state.systems.get(SystemConstants.SYSTEMS.SMALL_SCALE_MANUFACTURING).damage >= 1) {
			this.repairSelectedSystems();
		}
		// plot FTL path
		if (this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.LONG_RANGE_SCANNERS) && this.state.systems.get(SystemConstants.SYSTEMS.LONG_RANGE_SCANNERS).damage >= 1 && this.state.systemsDiscovered.has(SystemConstants.SYSTEMS.FTL_COMPUTER) && this.state.systems.get(SystemConstants.SYSTEMS.FTL_COMPUTER).damage >= 1) {
			this.addPath(1);
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
	isWon: function() {
        if (this.state.pathPlotted >= SystemConstants.MAX_PATH_TO_PLOT) {
			for (var winningSystem of SystemConstants.WINNING_SYSTEMS) {
				if (!this.state.systemsDiscovered.has(winningSystem)) {
					return false;
				}
			}

			return true;
        }

        return false;
	},

	render: function() {
		return <div>
			{this.isDebugMode() && <DebugTools addSystem={this.discoverNewSystem} decodeAllSystems={this.decodeAllSystems} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />}
			<UserPanel userAction={this.state.userAction} setUserAction={this.setUserAction} allSystemsDiscovered={this.allSystemsDiscovered()} timer={this.state.timer} availablePower={this.state.availablePower} atMaxPower={this.atMaxPower()} atZeroPower={this.atZeroPower()} pathPlotted={this.state.pathPlotted} logMessages={this.state.logMessages} />
			<SystemsRenderer systemsSelected={this.state.systemsSelected} selectSystem={this.selectSystem} deselectSystem={this.deselectSystem}>{this.getSystemsDiscovered()}</SystemsRenderer>
			{this.isWon() && <WinScreen isWon={this.isWon()} />}
		</div>;
	}
});

ReactDOM.render(
	<Clicker />,
	document.getElementById('content')
);
