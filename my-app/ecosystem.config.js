module.exports = {
    apps: [
      {
        name: 'my-app',
        script: 'npm',
        args: 'start',
        exec_mode: 'cluster',
        instances: 'max', // or specify a number, e.g., 4
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };