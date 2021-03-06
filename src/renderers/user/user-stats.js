import React, { Component } from 'react';

var GameConstants = require('../../game-constants');

class UserStats extends Component {
	render = () => {
		var statsCss = {
			clear: 'both',
		};
		var powerBarCss = {
			width: '200px',
			height: '2em',
			margin: '5px',
			backgroundImage: 'url(img/empty_tiling_power.png)',
		};
		var powerCss = {
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
		var ftlBarCss = {
			width: '200px',
			height: '2em',
			margin: '5px',
			backgroundImage: 'url(img/empty_tiling_atoms.png)',
		};
		var fltCss = {
			width: (this.props.ftlCharge / GameConstants.MAX_FTL_TO_CHARGE * 100) + '%',
			height: '100%',
			backgroundImage: 'url(img/tiling_atoms.png)',
		}
		return <div style={statsCss}>
			<h2>Resources</h2>
			<p>{this.props.timer} turns passed</p>
			{this.props.distanceVisible && <p>{this.props.distanceToHome} lightyears to home</p>}
            <div style={powerBarCss}>
				<div style={powerCss} />
			</div>
			{this.props.pathPlotted > 0 && <div style={pathBarCss}>
				<div style={pathCss} />
			</div>}
			{this.props.ftlCharge > 0 && <div style={ftlBarCss}>
				<div style={fltCss} />
			</div>}
		</div>;
	}
}

export default UserStats;
