import React, { Component } from 'react';

const MAIN_THRUSTERS_SPEED='10s'
const MANUVERING_THRUSTERS_SPEED='60s'

class SpaceWindow extends Component {
	render = () => {
		var windowAnimation = {
			width: '100%',
			backgroundImage: 'url(img/stars.jpg)',
		}
		if (this.props.mainThrustersActive) {
			windowAnimation.animation = 'slideBackground ' + MAIN_THRUSTERS_SPEED + ' linear infinite';
		}
		else if (this.props.manuveringThrustersActive) {
			windowAnimation.animation = 'slideBackground ' + MANUVERING_THRUSTERS_SPEED + ' linear infinite';
		}
		
		return <div style={{
				position: 'absolute',
				bottom: '15%',
				right: '5%',
				width: '50%'}}>
				<img style={windowAnimation} src="img/window.png" />
  		</div>;
	}
}

export default SpaceWindow;
