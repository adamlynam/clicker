import React, { Component } from 'react';
import ReactDOM from 'react-dom';

var SystemConstants = require('../../systems/system-constants');

class UserLog extends Component {
	componentDidUpdate = () => {
		var logText = ReactDOM.findDOMNode(this.refs.logText);;
		logText.scrollTop = logText.scrollHeight;
	}

	render = () => {
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
			backgroundColor: '#000000',
            border: '1px dotted #000000',
            padding: '0px 10px 0px 10px',
			color: '#ffffff',
            overflow: 'auto',
		};
		return <div style={logCss}>
			<h2>Log</h2>
            <div style={logTextCss} ref="logText" >{this.props.children.map((message, index) => {
    		    return <p key={index}>{message}</p>
    		})}
            </div>
		</div>;
	}
}

export default UserLog;
