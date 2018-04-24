var SystemConstants = require('./systems/system-constants');

module.exports = {
    MAX_DISTANCE_TO_HOME: 999999,
    MAX_PATH_TO_PLOT: 100,
    MAX_FTL_TO_CHARGE: 100,
    MAX_POWER: 100,
    // decimal percentage per user tick (e.g. percentage / 100)
    SYSTEM_DISCOVERY_CHANCE: 0.1,
    LEARN_DISCOVERY_CHANCE: 0.1,
    MANUVERING_THRUSTERS_DISTANCE: 1,
    MAIN_THRUSTERS_DISTANCE: 100,
    FTL_JUMP_BUFFER_DISTANCE: 100 * 20,
}
