var React = require('react');
var ReactDOM = require('react-dom');

var GameConstants = require('../../game-constants');

module.exports = React.createClass({
	render: function() {
		var statsCss = {
			clear: 'both',
		};
		var chargeBarCss = {
			width: '200px',
			height: '2em',
			margin: '5px',
			backgroundImage: 'url(img/empty_tiling_power.png)',
		};
		var chargeCss = {
			width: (this.props.availablePower / GameConstants.MAX_POWER * 100) + '%',
			height: '100%',
			backgroundImage: 'url(img/tiling_power.png)',
		}
		var pathBarCss = {
			width: '200px',
			height: '2em',
			margin: '5px',
			backgroundImage: 'url(img/empty_tiling_starpath.png)',
		};
		var pathCss = {
			width: (this.props.pathPlotted / GameConstants.MAX_PATH_TO_PLOT * 100) + '%',
			height: '100%',
			backgroundImage: 'url(img/tiling_starpath.png)',
		}
		return <div style={statsCss}>
			<h2>Resources</h2>
			<p>{this.props.timer} turns passed</p>
			{this.props.distanceVisible && <p>{this.props.distanceToHome} lightyears to home</p>}
            <div style={chargeBarCss}>
				<div style={chargeCss} />
			</div>
			{this.props.pathPlotted > 0 && <div style={pathBarCss}>
				<div style={pathCss} />
			</div>}
		</div>;
	}
});
