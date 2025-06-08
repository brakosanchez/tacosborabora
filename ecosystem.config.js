const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Verificar si los directorios de logs existen
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

module.exports = {
  apps: [
    {
      name: 'backend-api',
      cwd: __dirname,
      script: '.\\start_backend.bat',
      interpreter: 'cmd.exe',
      interpreter_args: '/c',
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      error_file: path.join(__dirname, 'logs', 'backend-error.log'),
      out_file: path.join(__dirname, 'logs', 'backend-out.log'),
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '1G'
    },
    {
      name: 'frontend-web',
      cwd: __dirname,
      script: '.\\start_frontend.bat',
      interpreter: 'cmd.exe',
      interpreter_args: '/c',
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      error_file: path.join(__dirname, 'logs', 'frontend-error.log'),
      out_file: path.join(__dirname, 'logs', 'frontend-out.log'),
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '1G'
    },
    {
      name: 'cloudflare-tunnel',
      cwd: __dirname,
      script: 'cmd.exe',
      args: '/c "%USERPROFILE%\\scoop\\shims\\cloudflared.exe" tunnel --config .cloudflared/config.yml run',
      interpreter: 'cmd.exe',
      interpreter_args: '/c',
      exec_mode: 'fork',
      windowsHide: true,
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
      error_file: path.join(__dirname, 'logs', 'cloudflare-error.log'),
      out_file: path.join(__dirname, 'logs', 'cloudflare-out.log'),
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '1G'
    },
  ],
};