module.exports = {
    apps: [{
      name: "product-service",
      script: "build/server.js",
      env: {
        NODE_ENV: "production"
      },
      env_test: {
        NODE_ENV: "test",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
}