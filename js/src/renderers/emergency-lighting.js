var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	render: function() {
		var fullScreenCss = {
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            backgroundColor: '#ff1111',
            opacity: '0.5',
            pointerEvents: 'none',
		};
		return <div style={fullScreenCss}>
  		</div>;
	}
});
