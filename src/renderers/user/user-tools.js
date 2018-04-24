import React, { Component } from 'react';

var UserActionContants = require('../../actions/user-actions-constants');

class UserTools extends Component {
  setUserActionToNothing = (object) => {
      this.props.setUserAction(UserActionContants.NOTHING);
  }

  setUserActionToDiscoverSystems = (object) => {
      this.props.setUserAction(UserActionContants.DISCOVER_SYSTEMS);
  }

  setUserActionToRepairSystems = (object) => {
      this.props.setUserAction(UserActionContants.REPAIR_SYSTEMS);
  }

  setUserActionToLearnShipLanguage = (object) => {
      this.props.setUserAction(UserActionContants.LEARN_SHIP_LANGUAGE);
  }

  setUserActionToGeneratePower = (object) => {
      this.props.setUserAction(UserActionContants.GENERATE_POWER);
  }

	render = () => {
        var userOptionCss = {
			position: 'relative',
			float: 'left',
			margin: '5px',
			padding: '10px',
			width: '200px',
			backgroundColor: '#eeeeee',
			border: '3px solid #000000',
			cursor: 'pointer',
			textAlign: 'center',
        };
		return <div>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToNothing} checked={this.props.userAction == UserActionContants.NOTHING ? true : null} />
                <span>Do Nothing</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToDiscoverSystems} checked={this.props.userAction == UserActionContants.DISCOVER_SYSTEMS ? true : null} disabled={this.props.allSystemsDiscovered} readOnly={this.props.allSystemsDiscovered} />
                <span>Discover Systems</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToRepairSystems} checked={this.props.userAction == UserActionContants.REPAIR_SYSTEMS ? true : null} disabled={this.props.atZeroPower} readOnly={this.props.atZeroPower} />
                <span>Repair Systems</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToLearnShipLanguage} checked={this.props.userAction == UserActionContants.LEARN_SHIP_LANGUAGE ? true : null} disabled={this.props.allWordsLearned} readOnly={this.props.allWordsLearned} />
                <span>Learn Language</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToGeneratePower} checked={this.props.userAction == UserActionContants.GENERATE_POWER ? true : null} disabled={this.props.atMaxPower} readOnly={this.props.atMaxPower} />
                <span>Generate Power</span>
            </label>
            {this.props.fltJumpReady && <label style={userOptionCss} onClick={this.props.performFtlJump}>
                <span>Initiate FTL Jump</span>
            </label>}
		</div>;
	}
}

export default UserTools;
