
module.exports = {
    apps: [
      {
        name: 'uc',
        port: process.env.PORT || '4242',
        args: 'start',
        exec_mode: 'cluster',
        instances: '1',
        /*script: './node_modules/nuxt/bin/nuxt.js',*/
        script: './.output/server/index.mjs',
        watch: false, // Set to true if you want PM2 to watch for changes and automatically restart
        autorestart: true, // Set to true if you want PM2 to automatically restart the app on failure
        max_memory_restart: '1G', // Restart the app if it exceeds 1GB memory usage
        log_date_format: 'YYYY-MM-DD HH:mm:ss', // Customize log date format
        out_file: '../logs/out.log', // Specify the output log file
        error_file: '../logs/error.log', // Specify the error log file
        combine_logs: true, // Combine logs from different instances into one file
        merge_logs: true, // Merge logs for all instances
      }
    ]
  }