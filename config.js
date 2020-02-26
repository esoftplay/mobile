{
  "config": {
    "timezone": "Asia/Jakarta",
    "protocol": "http",                       // http or https
    "domain": "esoftplay.com",                // naked domain to website
    "api": "api",                             // optional: subdomain to access web API
    "data": "data",                           // optional: subdomain to access web content / article
    "uri": "/",                               // relatif path to main website
    "home": {                                 // define the frontpage for module/task
      "member": "content/member",             // when user has been logged in
      "public": "content"                     // when user not login yet
    },
    "errorReport": {                          // add telegram ids to listenReport Error
      "telegramIds": [
        "111111111"
      ]
    },
    "group_id":'1,2',                         // string separated comma
    "isDebug": 1,                             // optional: display console on esp.log('any message'), don't use it for automatic detect the environment (production / development)
    "salt": "CHANGE_INTO_YOUR_OWN_SALT",      // SALT form config.php in your website
    "notification": 1,                        // optional: to determine is this application have notification or not
    "firebase": {                             // https://console.firebase.google.com - download google-services.json
      "apiKey": "FIREBASE_Web_API_Key",       // Eg. AIzaSyAvVyNeXI3RTo7Tl5LCBSZ-mu92VpbPBK8Y
      "authDomain": "FIREBASE_authDomain",    // Eg. project-6495177974885932998.firebaseapp.com
      "databaseURL": "FIREBASE_Database_URL", // Eg. https://project-6495177974885932998.firebaseio.com/
      "storageBucket": "FIREBASE_Storage_URL" // Eg. test://project-6495177974885932998.appspot.com/
    },
    "iosClientId":"Ios Client id untuk keperluan google login",
    "facebookAppId":"APP ID dari Aplikasi yang didaftarkan di Facebook Developer",
    "theme":[],                                // untuk custom theme jika diperlukan,silahkan lihat module LibTheme untuk cara peggunaannya
    "langIds":[],                              // untuk custom language jika diperlukan, silahkan lihatmodule LibLocale untuk cara penggunaanya
    "fonts":{
      "fontName":"fontName.ttf or .otf",       //  taruh file font di assets/fonts/ jika ingin custom fonts bisa lebih dari 1
      "fontName2":"fontName2.ttf or .otf"
    }
  }
}