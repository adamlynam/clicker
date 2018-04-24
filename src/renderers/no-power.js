import React, { Component } from 'react';

var MAX_OPACITY = 0.99;

class NoPower extends Component {
	render = () => {
		var fullScreenCss = {
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            backgroundColor: '#111111',
            opacity: (this.props.lumens * MAX_OPACITY),
            pointerEvents: 'none',
		};
		return <div style={fullScreenCss}>
  		</div>;
	}
}

export default NoPower;
