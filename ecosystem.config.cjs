// Site: http://localhost:8090  CMS (local files, no sign-in): http://localhost:8090/admin/
module.exports = {
  apps: [
    {
      name: 'linux-victoria-website-decap',
      script: 'npm',
      args: 'start -- --port 8090',
      cwd: __dirname,
    },
    {
      name: 'linux-victoria-website-decap-cms',
      script: 'npm',
      args: 'run cms',
      cwd: __dirname,
    },
  ],
};
