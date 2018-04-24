function randomLetter() {
    var charset = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    return charset.charAt(Math.floor(Math.random() * charset.length));
}

function generateScrambledText(text) {
    var scrambledText = "";
    for (var letter of text) {
        scrambledText += randomLetter();
    }
    return scrambledText;
}

module.exports = {
    scramble: function(text) {
        return generateScrambledText(text);
    },
}
