var React = require('react');
var ReactDOM = require('react-dom');

var SystemRenderer = require('./system');

module.exports = React.createClass({
	isActive(system) {
		for (var activeSystem of this.props.activeSystems) {
			if (activeSystem.unscrambledName == system.unscrambledName) {
				return true;
			}
		}

		return false;
	},

	render: function() {
		var systemsCss = {
			width: '50%',
		};
		return <div style={systemsCss}>{this.props.children.map(system => {
		    return <SystemRenderer isActive={this.isActive(system)} activateSystem={this.props.activateSystem} deactivateSystem={this.props.deactivateSystem} key={system.key}>{system}</SystemRenderer>
		})}</div>
	}
});
