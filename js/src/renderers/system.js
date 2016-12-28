var React = require('react');
var ReactDOM = require('react-dom');

var SystemName = require('./system-name');

module.exports = React.createClass({
	render: function() {
		var systemCss = {
			margin: '5px',
			padding: '10px',
			width: '200px',
			backgroundImage: 'url(img/tiling_circuits.png)',
			textAlign: 'center'
		};
		var letters = this.props.children.name.split('');
		return <div style={systemCss}>
			<SystemName>{this.props.children}</SystemName>
		</div>;
	}
});
