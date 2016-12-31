var React = require('react');
var ReactDOM = require('react-dom');

var SystemConstants = require('../../systems/system-constants');

var SystemRenderer = require('./system');

module.exports = React.createClass({
	isHighlighted(systemKey) {
		return this.props.noPower && systemKey == SystemConstants.SYSTEMS.AUXILIARY_POWER
	},
	isSelected(systemKey) {
		return this.props.systemsSelected.has(systemKey);
	},

	render: function() {
		var systemsCss = {
			float: 'left',
			width: '50%',
		};
		return <div style={systemsCss}>{this.props.children.map(system => {
		    return <SystemRenderer noPower={this.props.noPower} isHighlighted={this.isHighlighted(system.key)} isSelected={this.isSelected(system.key)} selectSystem={this.props.selectSystem} deselectSystem={this.props.deselectSystem} key={system.key}>{system}</SystemRenderer>
		})}</div>
	}
});
