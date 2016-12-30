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
			systemsUndiscovered: [...SystemConstants.ALL_SYSTEMS],
			systemsDiscovered: [],
			systemsSelected: [],
			lastKey: 1,
			gameTimerInterval: gameTimerInterval,
			userAction: UserActionConstants.NOTHING,
			timer: 0,
			availablePower: 0,
			pathPlotted: 0,
		};
	},
	getUndiscoveredSystem: function() {
		return {
	        name: this.state.systemsUndiscovered[Math.floor(Math.random() * this.state.systemsUndiscovered.length)],
			damage: Math.floor(Math.random() * 100) / 100,
	    }
	},
	discoverNewSystem: function() {
		var newSystem = this.getUndiscoveredSystem();
		var scrambledSystem = SystemScrambler.scramble(newSystem);

		this.setState((previousState, currentProps) => {
			var newKey = previousState.lastKey + 1;
			return {
				systemsUndiscovered: [
					...previousState.systemsUndiscovered.slice(0, previousState.systemsUndiscovered.indexOf(newSystem.name)),
					...previousState.systemsUndiscovered.slice(previousState.systemsUndiscovered.indexOf(newSystem.name) + 1)
				],
				systemsDiscovered: [...previousState.systemsDiscovered, Object.assign(scrambledSystem, {key: newKey.toString()})],
				lastKey: newKey
			};
		});
		//this.addLogMessage("You have discovered " + scrambledSystem.name + ", a new ship system.");
	},
	decodeSystemName: function(system) {
		if (this.state.systemsDiscovered.indexOf(system) > -1) {
			var decodedSystem = SystemScrambler.decodeStep(system);

			this.setState((previousState, currentProps) => {
			    return {
					systemsDiscovered: [
						...previousState.systemsDiscovered.slice(0, previousState.systemsDiscovered.indexOf(system)),
						Object.assign(decodedSystem, {key: system.key}),
						...previousState.systemsDiscovered.slice(previousState.systemsDiscovered.indexOf(system) + 1)
					]
				};
			});
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
				availablePower: Math.min(SystemConstants.MAX_POWER, previousState.availablePower + power),
			};
		});
	},
	addPath: function(path) {
		this.setState((previousState, currentProps) => {
			if (previousState.pathPlotted % 25 == 0) {
				this.addLogMessage("FTL Travel Path " + previousState.pathPlotted + "% calculated.");
			}
			return {
				pathPlotted: Math.min(SystemConstants.MAX_PATH_TO_PLOT, previousState.pathPlotted + path),
			};
		});
	},
	repairSystem: function(system, repairAmount) {
		if (this.state.availablePower > 0) {
			var discoveredSystem = this.state.systemsDiscovered.find(discoveredSystem => {
				return discoveredSystem.unscrambledName == system.unscrambledName;
			});
			if (discoveredSystem.damage < 1) {
				var repairedSystem = Object.assign(Object.assign({}, discoveredSystem), {
		            damage: discoveredSystem.damage + repairAmount,
		        });
				this.setState((previousState, currentProps) => {
				    return {
						availablePower: previousState.availablePower - 1,
						systemsDiscovered: [
							...previousState.systemsDiscovered.slice(0, previousState.systemsDiscovered.indexOf(discoveredSystem)),
							Object.assign(repairedSystem, {key: discoveredSystem.key}),
							...previousState.systemsDiscovered.slice(previousState.systemsDiscovered.indexOf(discoveredSystem) + 1)
						]
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
	selectSystem: function(system) {
		var activeSystemIndex = this.state.systemsSelected.findIndex(activeSystem => {
			return activeSystem.unscrambledName == system.unscrambledName;
		});
		if (activeSystemIndex < 0) {
			this.setState((previousState, currentProps) => {
				return {
					systemsSelected: [...previousState.systemsSelected, system],
				};
			});
		}
	},
	deselectSystem: function(system) {
		var activeSystemIndex = this.state.systemsSelected.findIndex(activeSystem => {
			return activeSystem.unscrambledName == system.unscrambledName;
		});
		if (activeSystemIndex > -1) {
			this.setState((previousState, currentProps) => {
				return {
					systemsSelected: [
						...previousState.systemsSelected.slice(0, activeSystemIndex),
						...previousState.systemsSelected.slice(activeSystemIndex + 1)
					]
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

	decodeAllSystems: function() {
		for (var system of this.state.systemsDiscovered) {
			this.decodeSystemName(system);
		}
	},
	allSystemsDiscovered: function() {
		return this.state.systemsDiscovered.length >= SystemConstants.ALL_SYSTEMS.length;
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
		for (var system of this.state.systemsSelected) {
			this.repairSystem(system, UserActionConstants.REPAIR_PER_TICK);
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
		for (var system of this.state.systemsDiscovered) {
			if (system.unscrambledName == "Main Power" && system.damage >= 1) {
				this.addPower(2);
			}
			if (system.unscrambledName == "Auxiliary Power" && system.damage >= 1) {
				this.addPower(1);
			}
			if (system.unscrambledName == "Universal Translator" && system.damage >= 1) {
				this.decodeAllSystems();
			}
			if (system.unscrambledName == "Large Scale Manufacturing" && system.damage >= 1) {
				this.repairSelectedSystems();
			}
			if (system.unscrambledName == "Small Scale Manufacturing" && system.damage >= 1) {
				this.repairSelectedSystems();
			}
		}
		var longRangeScanners = this.state.systemsDiscovered.find(discoveredSystem => {
			return discoveredSystem.unscrambledName == "Long Range Scanners";
		});
		var ftlComputer = this.state.systemsDiscovered.find(discoveredSystem => {
			return discoveredSystem.unscrambledName == "FTL Computer";
		});
		if (longRangeScanners && longRangeScanners.damage >= 1 && ftlComputer && ftlComputer.damage >= 1) {
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

	render: function() {
		return <div>
			{this.isDebugMode() && <DebugTools addSystem={this.discoverNewSystem} decodeAllSystems={this.decodeAllSystems} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />}
			<UserPanel userAction={this.state.userAction} setUserAction={this.setUserAction} allSystemsDiscovered={this.allSystemsDiscovered()} timer={this.state.timer} availablePower={this.state.availablePower} atMaxPower={this.atMaxPower()} atZeroPower={this.atZeroPower()} pathPlotted={this.state.pathPlotted} logMessages={this.state.logMessages} />
			<SystemsRenderer systemsSelected={this.state.systemsSelected} selectSystem={this.selectSystem} deselectSystem={this.deselectSystem}>{this.state.systemsDiscovered}</SystemsRenderer>
			<WinScreen systemsDiscovered={this.state.systemsDiscovered} pathPlotted={this.state.pathPlotted} />
		</div>;
	}
});

ReactDOM.render(
	<Clicker />,
	document.getElementById('content')
);
