module.exports = {
    getVersion  :function (req, res) {
        return res.status(200).send(['1.1.0','1.0.1','1.1.1'])
    }
}