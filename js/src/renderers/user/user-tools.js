var React = require('react');
var ReactDOM = require('react-dom');

var UserActionContants = require('../../actions/user-actions-constants');

module.exports = React.createClass({
    setUserActionToNothing: function(object) {
        this.props.setUserAction(UserActionContants.NOTHING);
    },
    setUserActionToDiscoverSystems: function(object) {
        this.props.setUserAction(UserActionContants.DISCOVER_SYSTEMS);
    },
    setUserActionToRepairSystems: function(object) {
        this.props.setUserAction(UserActionContants.REPAIR_SYSTEMS);
    },
    setUserActionToLearnShipLanguage: function(object) {
        this.props.setUserAction(UserActionContants.LEARN_SHIP_LANGUAGE);
    },
    setUserActionToGeneratePower:  function(object) {
        this.props.setUserAction(UserActionContants.GENERATE_POWER);
    },

	render: function() {
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
                <input name="current-action" type="radio" onChange={this.setUserActionToLearnShipLanguage} checked={this.props.userAction == UserActionContants.LEARN_SHIP_LANGUAGE ? true : null} />
                <span>Learn Language</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToGeneratePower} checked={this.props.userAction == UserActionContants.GENERATE_POWER ? true : null} disabled={this.props.atMaxPower} readOnly={this.props.atMaxPower} />
                <span>Generate Power</span>
            </label>
		</div>;
	}
});
