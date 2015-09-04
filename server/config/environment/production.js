'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            //'mongodb://govic:admin@proximus.modulusmongo.net:27017/tyQi3xax'
            //'mongodb://govic:admin@proximus.modulusmongo.net:27017/ydipo4Nu'
            'mongodb://admin:govic@apollo.modulusmongo.net:27017/hUgomo3b'

  },
  constantes: {
        carpeta_publica: '../../../public/assets/'
    }
};