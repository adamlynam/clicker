import React, { Component } from 'react';

import UserTools from './user-tools';
import UserStats from './user-stats';
import UserLog from './user-log';

class UserPanel extends Component {

	render = () => {
        var userPanelCss = {
			float: 'left',
            width: '50%',
        };
		return <div style={userPanelCss}>
            <UserTools userAction={this.props.userAction} setUserAction={this.props.setUserAction} allSystemsDiscovered={this.props.allSystemsDiscovered} allWordsLearned={this.props.allWordsLearned} fltJumpReady={this.props.fltJumpReady} performFtlJump={this.props.performFtlJump} atMaxPower={this.props.atMaxPower} atZeroPower={this.props.atZeroPower} />
			<UserStats timer={this.props.timer} distanceVisible={this.props.distanceVisible} distanceToHome={this.props.distanceToHome} availablePower={this.props.availablePower} pathPlotted={this.props.pathPlotted} ftlCharge={this.props.ftlCharge} />
			<UserLog>{this.props.logMessages}</UserLog>
		</div>;
	}
}

export default UserPanel;
