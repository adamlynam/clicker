function randomLetter() {
    var charset = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    return charset.charAt(Math.floor(Math.random() * charset.length));
}

function generateScrambledName(name) {
    var scrambledName = "";
    for (var letter of name) {
        scrambledName += randomLetter();
    }
    return scrambledName;
}

module.exports = {
    scramble: function(system) {
        return Object.assign(Object.assign({}, system), {
            name: generateScrambledName(system.name),
            unscrambledName: system.name
        });
    },
    decodeStep: function(system) {
        var decodedName = "";
        for (var i = 0; i < system.name.length; i++) {
            if (system.name[i] == system.unscrambledName[i]) {
                decodedName += system.name[i];
            }
            else {
                decodedName += randomLetter();
            }
        }
        return Object.assign(Object.assign({}, system), {
            name: decodedName
        });
    },
    unscramble: function(system) {
        return Object.assign(Object.assign({}, system), {
            name: system.unscrambledName
        });
    }
}
