var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	render: function() {
		var nameCss = {
			display: 'inline'
		}
		var letters = this.props.children.name.split('');
		return <p style={nameCss}>{letters.map((letter, index) => {
			var letterCss = {
				color: letter == this.props.children.unscrambledName[index] ? '#000000' : '#ff0000'
			};
			return <span key={index} style={letterCss} >{letter}</span>;
		})}</p>;
	}
});
