var React = require('react');
var ReactDOM = require('react-dom');

var UserActionContants = require('../actions/user-actions-constants');

module.exports = React.createClass({
    addNewSystem: function(object) {
        this.props.addSystem();
    },
    decodeAllSystems: function(object) {
        this.props.decodeAllSystems();
    },
    changeUserActionToNothing: function(object) {
        this.props.setUserAction(UserActionContants.NOTHING);
    },
    changeUserActionToDiscoverSystems: function(object) {
        this.props.setUserAction(UserActionContants.DISCOVER_SYSTEMS);
    },
    changeUserActionToLearnShipLanguage: function(object) {
        this.props.setUserAction(UserActionContants.LEARN_SHIP_LANGUAGE);
    },
    fullyUnscrambleAllSystems: function(object) {
        this.props.fullyUnscrambleAllSystems();
    },

	render: function() {
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
});
