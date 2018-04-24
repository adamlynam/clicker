import React, { Component } from 'react';

import SystemRenderer from './system';

class Systems extends Component {
	isHighlighted = (systemKey) => {
		return this.props.systemsHighlighted.has(systemKey);
	}

	isSelected = (systemKey) => {
		return this.props.systemsSelected.has(systemKey);
	}

	render = () => {
		var systemsCss = {
			float: 'left',
			width: '50%',
		};
		return <div style={systemsCss}>{this.props.children.map(system => {
		    return <SystemRenderer noLights={this.props.noLights} isHighlighted={this.isHighlighted(system.key)} isSelected={this.isSelected(system.key)} selectSystem={this.props.selectSystem} deselectSystem={this.props.deselectSystem} translate={this.props.translate} key={system.key}>{system}</SystemRenderer>
		})}</div>
	}
}

export default Systems;
