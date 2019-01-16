module.exports = (mongoose) => {
    const pincodeSchema = new mongoose.Schema({
        pin: Number,
        created: Date
    });

    /*
     * static model methods
     */

    pincodeSchema.statics.pinExists = function(pin) {
        this.model('Pincode').find({ pin: pin }, (err, docs) => {
            if (err) {
                console.log(err);
                return false;
            }

            return docs.length == 0;
        });
    }

    const Pincode = mongoose.model('Pincode', pincodeSchema);
    return Pincode;
}
