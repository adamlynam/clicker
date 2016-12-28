var React = require('react');
var ReactDOM = require('react-dom');

var SystemName = require('./system-name');

module.exports = React.createClass({
	toggleActiveness: function(object) {
		if (this.props.isActive) {
			this.props.deactivateSystem(this.props.children);
		} else {
			this.props.activateSystem(this.props.children);
		}
	},

	render: function() {
		var systemCss = {
			float: 'left',
			margin: '5px',
			padding: '10px',
			width: '200px',
			backgroundImage: 'url(img/tiling_circuits.png)',
			border: this.props.isActive ? '3px solid #33dd33' : '3px solid #ff0000',
			cursor: 'pointer',
			textAlign: 'center',
		};
		var letters = this.props.children.name.split('');
		return <div style={systemCss} onClick={this.toggleActiveness}>
			<SystemName>{this.props.children}</SystemName>
		</div>;
	}
});
