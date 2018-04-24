import React, { Component } from 'react';

class SystemName extends Component {
	render = () => {
		var nameCss = {
			display: 'inline',
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
		}
		var letters = this.props.translate(this.props.children.key).split("");
		return <p style={nameCss}>{letters.map((letter, index) => {
			var letterCss = {
				color: letter == this.props.children.key[index] ? '#000000' : '#ff0000'
			};
			return <span key={index} style={letterCss} >{letter}</span>;
		})}</p>;
	}
}

export default SystemName;
