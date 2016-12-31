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
    decodeStep: function(text, unscrambledText) {
        var decodedText = "";
        for (var i = 0; i < text.length; i++) {
            if (text[i] == unscrambledText[i]) {
                decodedText += text[i];
            }
            else {
                decodedText += randomLetter();
            }
        }
        return decodedText;
    }
}
