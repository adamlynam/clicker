import React, { Component } from 'react';

var UserActionContants = require('../actions/user-actions-constants');

class DebugTools extends Component {
  addNewSystem = (object) => {
      this.props.addSystem();
  }

  decodeAllSystems = (object) => {
      this.props.decodeAllSystems();
  }

  changeUserActionToNothing = (object) => {
      this.props.setUserAction(UserActionContants.NOTHING);
  }

  changeUserActionToDiscoverSystems = (object) => {
      this.props.setUserAction(UserActionContants.DISCOVER_SYSTEMS);
  }

  changeUserActionToLearnShipLanguage = (object) => {
      this.props.setUserAction(UserActionContants.LEARN_SHIP_LANGUAGE);
  }

  fullyUnscrambleAllSystems = (object) => {
      this.props.fullyUnscrambleAllSystems();
  }

	render = () => {
		return <div>
            <h2>Debug Panel</h2>
			<input type="button" onClick={this.addNewSystem} value="Add New System" />
			<input type="button" onClick={this.decodeAllSystems} value="Decode System Step" />
			<input type="button" onClick={this.changeUserActionToNothing} value="Change User Action to Nothing" />
			<input type="button" onClick={this.changeUserActionToDiscoverSystems} value="Change User Action to Discover Systems" />
			<input type="button" onClick={this.changeUserActionToLearnShipLanguage} value="Change User Action to Learn Ship Language" />
			<input type="button" onClick={this.fullyUnscrambleAllSystems} value="Fully Unscramble All System Names" />
		</div>;
	}
}

export default DebugTools;
