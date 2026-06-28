// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'url-shortener',
    script: 'src/app.js',
    instances: 'max', // Runs one instance per CPU core for max performance
    exec_mode: 'cluster',
    watch: false,
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Log rotation settings
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/var/log/url-shortener/error.log',
    out_file: '/var/log/url-shortener/out.log',
    merge_logs: true,
    max_memory_restart: '512M'
  }]
};