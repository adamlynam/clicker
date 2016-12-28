var React = require('react');
var ReactDOM = require('react-dom');

var SystemConstants = require('../systems/system-constants');

module.exports = React.createClass({
    checkForWin: function() {
        for (var winningSystem of SystemConstants.WINNING_SYSTEMS) {
            if (!this.props.activeSystems.find(activeSystem => {
                return activeSystem.unscrambledName == winningSystem;
            })) {
                return false;
            }
        }

        return true;
    },

	render: function() {
		var winGreyOutCss = {
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            backgroundColor: '#eeeeee',
            opacity: '0.8',
		};
		var winDialogCss = {
            position: 'fixed',
            top: '10%',
            left: '10%',
            width: '60%',
            padding: '10%',
            backgroundColor: '#333',
            opacity: '1.0',
            color: '#ffffff',
            fontSize: '8em',
		};
		return this.checkForWin() && <div style={winGreyOutCss}>
              <div style={winDialogCss}>Congratulations you made it home!</div>
  		</div>;
	}
});
