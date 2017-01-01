var React = require('react');
var ReactDOM = require('react-dom');

var SystemName = require('./system-name');

module.exports = React.createClass({
	toggleSelected: function(object) {
		if (this.props.isSelected) {
			this.props.deselectSystem(this.props.children.key);
		} else {
			this.props.selectSystem(this.props.children.key);
		}
	},

	render: function() {
		var isRepaired = this.props.children.damage < 1;
		var highlightSystemCss = {
			opacity: '0.2',
		};
		var nonHighlightSystemCss = {
			opacity: '0',
		};
		var systemCss = {
			position: 'relative',
			float: 'left',
			width: '200px',
			backgroundImage: 'url(img/broken_tiling_circuits.png)',
			border: isRepaired ? (this.props.isSelected ? '3px solid #dddd33' : '3px solid #ff0000') : '3px solid #33dd33',
			cursor: 'pointer',
			textAlign: 'center',
		};
		var damageCss = {
			width: (this.props.children.damage * 100) + '%',
			backgroundImage: 'url(img/tiling_circuits.png)',
			height: '50px',
		}
		var rowCss = systemCss;
		if (this.props.noLights) {
			rowCss = this.props.isHighlighted ? Object.assign(systemCss, highlightSystemCss) : Object.assign(systemCss, nonHighlightSystemCss);
		}
		return <div style={rowCss} onClick={this.toggleSelected}>
			<div style={damageCss} />
			<SystemName translate={this.props.translate}>{this.props.children}</SystemName>
		</div>;
	}
});
