var React = require('react');
var ReactDOM = require('react-dom');

var UserActionContants = require('./user-actions-constants');

module.exports = React.createClass({
    setUserActionToNothing: function(object) {
        this.props.setUserAction(UserActionContants.NOTHING);
    },
    setUserActionToDiscoverSystems: function(object) {
        this.props.setUserAction(UserActionContants.DISCOVER_SYSTEMS);
    },
    setUserActionToLearnShipLanguage: function(object) {
        this.props.setUserAction(UserActionContants.LEARN_SHIP_LANGUAGE);
    },

	render: function() {
        var userPanelCss = {
			float: 'left',
            width: '50%',
        };
        var userOptionCss = {
			float: 'left',
			margin: '5px',
			padding: '10px',
			width: '200px',
			backgroundColor: '#eeeeee',
			border: '3px solid #000000',
			cursor: 'pointer',
			textAlign: 'center',
        };
		return <div style={userPanelCss}>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToNothing} checked={this.props.userAction == UserActionContants.NOTHING ? true : null} />
                <span>Do Nothing</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToDiscoverSystems} checked={this.props.userAction == UserActionContants.DISCOVER_SYSTEMS ? true : null} disabled={this.props.allSystemsDiscovered} readOnly={this.props.allSystemsDiscovered} />
                <span>Discover Systems</span>
            </label>
            <label style={userOptionCss}>
                <input name="current-action" type="radio" onChange={this.setUserActionToLearnShipLanguage} checked={this.props.userAction == UserActionContants.LEARN_SHIP_LANGUAGE ? true : null} />
                <span>Learn Language</span>
            </label>
		</div>;
	}
});
