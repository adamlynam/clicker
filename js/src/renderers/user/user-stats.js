var React = require('react');
var ReactDOM = require('react-dom');

var SystemConstants = require('../../systems/system-constants');

module.exports = React.createClass({
	render: function() {
		var statsCss = {
			clear: 'both',
		};
		var progressBar = {
			position: 'relative',
			width: '200px',
			height: '2em',
			backgroundColor: '#cccccc',
		};
		var chargeCss = {
			width: (this.props.availablePower / SystemConstants.MAX_POWER * 100) + '%',
			height: '100%',
			backgroundColor: '#ffff00',
		}
		var chargeLabelCss = {
			position: 'absolute',
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '2em',
			margin: '0',
			padding: '0',
			textAlign: 'center',
			verticalAlign: 'middle',
		}
		return <div style={statsCss}>
			<h2></h2>
            <div style={progressBar}>
				<div style={chargeCss} />
				<p style={chargeLabelCss}>{this.props.availablePower}%</p>
			</div>
		</div>;
	}
});
