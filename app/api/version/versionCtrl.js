module.exports = {
    getVersion  :function (req, res) {
        return res.status(200).send(['1.2.0'])
    }
}