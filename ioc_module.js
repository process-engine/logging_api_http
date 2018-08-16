'use strict'

const {
  LoggingApiRouter,
  LoggingApiController,
} = require('./dist/commonjs/index');

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {
  container.register('LoggingApiRouter', LoggingApiRouter)
    .dependencies('LoggingApiController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('LoggingApiController', LoggingApiController)
    .dependencies('IdentityService', 'LoggingApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
