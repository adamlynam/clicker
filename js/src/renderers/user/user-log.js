var React = require('react');
var ReactDOM = require('react-dom');

var SystemConstants = require('../../systems/system-constants');

module.exports = React.createClass({
	render: function() {
		var logCss = {
            position: 'fixed',
            bottom: 0,
            left: 0,
            height: '50%',
            width: '45%',
            padding: '0px 30px 0px 30px',
		};
		var logTextCss = {
            height: '80%',
            width: '100%',
            border: '1px dotted #000000',
            padding: '0px 10px 0px 10px',
            overflow: 'auto',
		};
		return <div style={logCss}>
			<h2>Log</h2>
            <div style={logTextCss}>{this.props.children.map((message, index) => {
    		    return <p key={index}>{message}</p>
    		})}
            </div>
		</div>;
	}
});
