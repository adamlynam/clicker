var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	render: function() {
		var nameCss = {
			display: 'inline',
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
		}
		var letters = this.props.children.name.split('');
		return <p style={nameCss}>{letters.map((letter, index) => {
			var letterCss = {
				color: letter == this.props.children.key[index] ? '#000000' : '#ff0000'
			};
			return <span key={index} style={letterCss} >{letter}</span>;
		})}</p>;
	}
});
