var React = require('react');
var ReactDOM = require('react-dom');

var DebugTools = require('./dev/debug-tools');

var SystemConstants = require('./systems/system-constants');
var UserActionContants = require('./actions/user-actions-constants');
var UserTools = require('./actions/user-tools');

var WinScreen = require('./renderers/win-screen');
var SystemsRenderer = require('./renderers/systems');

var SystemScrambler = require('./language/system-scrambler');

var Clicker = React.createClass({
	getInitialState: function() {
		var gameTimerInterval = setInterval(() => {
			this.tick();
		}, 500);

		return {
			systemsUndiscovered: [...SystemConstants.ALL_SYSTEMS],
			systemsDiscovered: [],
			systemsActive: [],
			lastKey: 1,
			gameTimerInterval: gameTimerInterval,
			userAction: UserActionContants.NOTHING
		};
	},
	getUndiscoveredSystem: function() {
		return {
	        name: this.state.systemsUndiscovered[Math.floor(Math.random() * this.state.systemsUndiscovered.length)]
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
	setUserAction: function(userAction) {
		this.setState((previousState, currentProps) => {
			return {
				userAction: userAction
			};
		});
	},
	activateSystem: function(system) {
		if (this.state.systemsActive.indexOf(system) < 0) {
			this.setState((previousState, currentProps) => {
				return {
					systemsActive: [...previousState.systemsActive, system],
				};
			});
		}
	},
	deactivateSystem: function(system) {
		if (this.state.systemsActive.indexOf(system) > -1) {
			this.setState((previousState, currentProps) => {
				return {
					systemsActive: [
						...previousState.systemsActive.slice(0, previousState.systemsActive.indexOf(system)),
						...previousState.systemsActive.slice(previousState.systemsActive.indexOf(system) + 1)
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

	decodeAllSystems: function() {
		for (var system of this.state.systemsDiscovered) {
			this.decodeSystemName(system);
		}
	},
	attemptToDiscoverNewSystem: function() {
		if (this.state.systemsDiscovered.length >= SystemConstants.ALL_SYSTEMS.length) {
			console.log("No systems remain undiscovered");
		}
		else if (Math.random() < SystemConstants.SYSTEM_DISCOVERY_CHANCE) {
			console.log("Discovered new system");
			this.discoverNewSystem();
		}
		else {
			console.log("Failed to discover new system");
		}
	},

	tickUserAction: function() {
		if (this.state.userAction == UserActionContants.DISCOVER_SYSTEMS) {
			this.attemptToDiscoverNewSystem();
		}
		else if (this.state.userAction == UserActionContants.LEARN_SHIP_LANGUAGE) {
			this.decodeAllSystems();
		}
	},
	tick: function() {
		this.tickUserAction();
	},

	render: function() {
		return <div>
        	<h1>Clicker</h1>
			<DebugTools addSystem={this.discoverNewSystem} decodeAllSystems={this.decodeAllSystems} setUserAction={this.setUserAction} fullyUnscrambleAllSystems={this.fullyUnscrambleAllSystems} />
			<UserTools setUserAction={this.setUserAction} userAction={this.state.userAction} />
			<WinScreen activeSystems={this.state.systemsActive} />
			<SystemsRenderer activeSystems={this.state.systemsActive} activateSystem={this.activateSystem} deactivateSystem={this.deactivateSystem}>{this.state.systemsDiscovered}</SystemsRenderer>
		</div>;
	}
});

ReactDOM.render(
	<Clicker />,
	document.getElementById('content')
);
