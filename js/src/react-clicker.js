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
			systemsUndiscovered: [...SystemConstants.ALL_SYSTEMS],
			systemsDiscovered: [],
			systemsSelected: [],
			lastKey: 1,
			gameTimerInterval: gameTimerInterval,
			userAction: UserActionConstants.NOTHING,
			availablePower: 0,
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
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.attemptToDiscoverNewSystem();
			}
		}
		else if (this.state.userAction == UserActionConstants.REPAIR_SYSTEMS) {
			this.repairSelectedSystems();
		}
		else if (this.state.userAction == UserActionConstants.LEARN_SHIP_LANGUAGE) {
			this.decodeAllSystems();
		}
		else if (this.state.userAction == UserActionConstants.GENERATE_POWER) {
			if (this.atMaxPower()) {
				this.setUserAction(UserActionConstants.NOTHING);
			}
			else {
				this.addPower(1);
			}
		}
	},
	tick: function() {
		this.tickUserAction();
	},

	render: function() {
		return <div>
			{this.isDebugMode() && <DebugTools addSystem={this.discoverNewSystem} decodeAllSystems={this.decodeAllSystems} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />}
			<UserPanel userAction={this.state.userAction} setUserAction={this.setUserAction} allSystemsDiscovered={this.allSystemsDiscovered()} availablePower={this.state.availablePower} atMaxPower={this.atMaxPower()} />
			<SystemsRenderer systemsSelected={this.state.systemsSelected} selectSystem={this.selectSystem} deselectSystem={this.deselectSystem}>{this.state.systemsDiscovered}</SystemsRenderer>
			<WinScreen systemsDiscovered={this.state.systemsDiscovered} />
		</div>;
	}
});

ReactDOM.render(
	<Clicker />,
	document.getElementById('content')
);
