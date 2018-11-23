const env = process.env.NODE_ENV || 'desarrollo';

if (env === 'desarrollo' || env === 'prueba') {
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  })
}
