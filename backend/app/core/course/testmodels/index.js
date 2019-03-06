// this is just a proxy that loads the test models from this directory

module.exports = {
    Models: [
        require('./multiple_choice'),
        require('./multiple_option'),
        require('./radio_button'),
        require('./speed')
    ],
    Factory: {
        create: (name, config) => {
            for (const model of module.exports.Models) {
                if (model.name === name) {
                    return new model(config);
                }
            }

            return null;
        }
    },
}
