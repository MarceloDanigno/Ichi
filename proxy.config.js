const proxy = [
    {
      context: '/api',
      target: 'http://localhost:8100',
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = proxy;