#!/usr/bin/env node

var SwaggerClient = require('swagger-client');
var _ = require('lodash');

var swaggerParsers = {
    '1.2': require('../parsers/1.2'),
    '2.0': require('../parsers/2.0')
};

var url = process.argv[2];

var client = SwaggerClient(url)
  .then(client => {
    const version = client.spec.swagger;
    if (!_.has(swaggerParsers, version)) {
        throw new Error('Unsupported swagger version - ' + version);
    }
    swaggerParsers[version](client);
  })
  .catch((e) => console.log(`ERROR: ${e.message}`));
