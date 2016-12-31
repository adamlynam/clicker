var React = require('react');
var ReactDOM = require('react-dom');

var SystemRenderer = require('./system');

module.exports = React.createClass({
	isSelected(systemKey) {
		return this.props.systemsSelected.has(systemKey);
	},

	render: function() {
		var systemsCss = {
			float: 'left',
			width: '50%',
		};
		return <div style={systemsCss}>{this.props.children.map(system => {
		    return <SystemRenderer isSelected={this.isSelected(system.key)} selectSystem={this.props.selectSystem} deselectSystem={this.props.deselectSystem} key={system.key}>{system}</SystemRenderer>
		})}</div>
	}
});
