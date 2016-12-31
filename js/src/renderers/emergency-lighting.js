var React = require('react');
var ReactDOM = require('react-dom');

var MAX_OPACITY = 0.5;

module.exports = React.createClass({
	render: function() {
		var fullScreenCss = {
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            backgroundColor: '#ff1111',
            opacity: (this.props.lumens * MAX_OPACITY),
            pointerEvents: 'none',
		};
		return <div style={fullScreenCss}>
  		</div>;
	}
});
