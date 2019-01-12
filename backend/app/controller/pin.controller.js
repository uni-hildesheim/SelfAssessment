module.exports = {
    createPin
}

// create a pseudo-random pin code
function createPin(req, res) {
    // length of the pin code, where each element is a digit
    // 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
    const LENGTH = 8

    var digits = new Array(LENGTH)
    var string = ''

    for (var i = 0; i < LENGTH; i++) {
        digits[i] = Math.floor(Math.random() * 10)
        string += digits[i]
    }

    const response = {
        'pin': string,
        'created': new Date()
    };

    res.send(response)
}
