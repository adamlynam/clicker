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
			backgroundImage: 'url(img/empty_tiling_power.png)',
		};
		var chargeCss = {
			width: (this.props.availablePower / SystemConstants.MAX_POWER * 100) + '%',
			height: '100%',
			backgroundImage: 'url(img/tiling_power.png)',
		}
		return <div style={statsCss}>
			<h2></h2>
            <div style={progressBar}>
				<div style={chargeCss} />
			</div>
		</div>;
	}
});
