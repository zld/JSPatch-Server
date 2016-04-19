/**
 * Created by zld on 16/4/19.
 */

var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jspatch');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('mongodb opened');
});

var relationshipSchema = mongoose.Schema({
    platform: String,
    version: String,
    file: String
});
var Relation = mongoose.model('Relation', relationshipSchema, 'relationship');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var deviceType = req.query.deviceType;
    Relation.find({platform: deviceType}, function(err, items) {
        if (items.length > 0) {
            var item = items[0];
            var filename = item.file;
            fs.readFile(path.dirname()+'/jsfiles/'+filename+'.js', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
                res.status(200).send(data);
                return;
            });
        }
    });
});

module.exports = router;
