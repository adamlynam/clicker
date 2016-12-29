var React = require('react');
var ReactDOM = require('react-dom');

var UserTools = require('./user-tools');
var UserStats = require('./user-stats');

module.exports = React.createClass({

	render: function() {
        var userPanelCss = {
			float: 'left',
            width: '50%',
        };
		return <div style={userPanelCss}>
            <UserTools userAction={this.props.userAction} setUserAction={this.props.setUserAction} allSystemsDiscovered={this.props.allSystemsDiscovered} atMaxPower={this.props.atMaxPower} />
			<UserStats availablePower={this.props.availablePower} />
		</div>;
	}
});
