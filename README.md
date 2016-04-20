# JSPatch-Server
practice with node.js

##How to use
### Install packages
```
npm install
```

###MongoDB
### Test Data

```
db.relationship.insert({
    appName: "AAA",
    platform: "iOS",
    version: "1.0.0",
    file: "patch-ios-1.0.0"
},
{
    appName: "AAA",
    platform: "iOS",
    version: "2.0.0",
    file: "patch-ios-1.0.0"
},
{
    appName: "AAA",
    platform: "Android",
    version: "1.0.0",
    file: "patch-android-1.0.0"
},
{
    appName: "BBB",
    platform: "Android",
    version: "2.0.0",
    file: "patch-android-2.0.0"
})
```

### JS Files

Put JS files into `jsfiles` folder

###Request with URL

Params | Type | Description 
------ | ---- | --------------
appName | String | name of App 
deviceType | String | iOS or Android 
appVersion | String | version of App

```
// GET -> Get js file
http://localhost:3000/jspatch?deviceType=iOS&appVersion=2.0.0&appName=hfs

// POST -> Refresh Cache
http://localhost:3000/jspatch
```