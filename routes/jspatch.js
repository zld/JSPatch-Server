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
    console.log('mongodb opened');
});

// Schema
var relationshipSchema = mongoose.Schema({
    platform: String,
    version: String,
    file: String
});
var Relation = mongoose.model('Relation', relationshipSchema, 'relationship');

// 缓存
var cacheMap = new Map();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var deviceType = req.query.deviceType;
    var appVersion = req.query.appVersion;
    var appName = req.query.appName;
    var keyForCache = deviceType+appVersion+appName;
    // 先从缓存中取
    var data = cacheMap.get(keyForCache);
    if (data) {
        res.status(200).send(data);
        console.log('already cached data: \n', data);
        return;
    }
    // 缓存中没有,从数据库中查找
    //noinspection JSAnnotator
    var deviceTypeReg = new RegExp(["^", deviceType, "$"].join(""), "i");;
    Relation.find({platform: deviceTypeReg, version: appVersion, appName: appName}, function(err, items) {
        if (items.length > 0) {
            var item = items[0];
            var filename = item.file;
            fs.readFile(path.dirname()+'/jsfiles/'+filename+'.js', 'utf8', function (err,data) {
                if (err) {
                    // 访问出错返回空字符串
                    res.status(200).send("");
                    return console.log(err);
                }
                // 加入缓存
                console.log('cache data: \n', data);
                cacheMap.set(keyForCache+appVersion+appName, data);
                res.status(200).send(data);
                return;
            });
        } else {
            res.status(200).send("");
        }
    });
});

router.post('/', function (req, res, next) {
    cacheMap.clear();
    res.status(200).send("Refresh Succeed");
    return;

    if (req.query.refresh == 1) {
        cacheMap.clear();
        res.status(200).send("Refresh Succeed");
    } else {
        res.status(200).send("");
    }
});

module.exports = router;
