#!/usr/bin/env node

var client = require('swagger-client');
var _ = require('lodash');

var indent = function (str) {
    return _.map(str.split('\n'), function (line) {
        return '    ' + line;
    }).join('\n');
}

var getPropType = function (definition) {
    if (definition.enum) {
        return 'React.PropTypes.oneOf(' + JSON.stringify(definition.enum, null, 4) + ')';
    }
    if (definition.$ref) {
        var name = definition.$ref.match('#/definitions/(.*)')[1];
        return 'PropTypes.' + name;
    }
    switch (definition.type) {
    case 'object':
        return 'React.PropTypes.shape({\n'
            + indent(_.map(definition.properties, function (property, name) {
                var keyPropType = convertDefinitionObjectToPropTypes(property, name);
                if (_.contains(definition.required || [], name)) {
                    keyPropType += '.isRequired';
                }
                return keyPropType;
            }).join(',\n')) +
        '\n})'
    case 'array':
        return 'React.PropTypes.arrayOf(' + getPropType(definition.items) + ')';
    case 'string':
        return 'React.PropTypes.string';
    case 'integer':
        return 'React.PropTypes.number';
    case 'boolean':
        return 'React.PropTypes.bool';
    default:
        return 'React.PropTypes.any';
    }
};

var convertDefinitionObjectToPropTypes = function (definition, name) {
    return name + ': ' + getPropType(definition);
};

var url = process.argv[2];

var swagger = new client({
    url: url,
    success: function() {
        var header = 'Generated PropTypes for ' + url;
        console.log('\n/**\n\n' + header + '\n' + new Array(header.length + 1).join('-') + '\n\n**/\n\n');

        console.log('var PropTypes = {\n');

        var propTypes = _.map(swagger.models, function (model, name) {
            return convertDefinitionObjectToPropTypes(model.definition, name);
        });
        console.log(indent(propTypes.join(',\n\n')));
        console.log('\n};\n\n');
    }
});