module.exports = (mongoose) => {
    const journalSchema = new mongoose.Schema({
        associatedPin: Number,
        data: Object
    });

    /*
     * static model methods
     */

    journalSchema.statics.get = function(pin) {
        this.model('Journal').find({ associatedPin: pin }, (err, docs) => {
            if (err) {
                console.log(err);
                return false;
            }

            // there can only be exactly one document for a given pin
            if (docs.length == 0) {
                return null;
            }

            return docs[0];
        });
    }

    const Journal = mongoose.model('Journal', journalSchema);
    return Journal;
}
