var _ = require('lodash');
var topsort = require('topsort');

var indent = function (str) {
    return _.map(str.split('\n'), function (line) {
        return '  ' + line;
    }).join('\n');
};

var missingRefPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined due to a missing Swagger model definition reference');
};

var unknownPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined from Swagger model definition');
};

var getPropType = function (definition) {
    if (definition.enum) {
        return 'React.PropTypes.oneOf(' + JSON.stringify(definition.enum, null, 2) + ')';
    }
    if (definition.$ref) {
        var name = definition.$ref.match('#/definitions/(.*)')[1];
        return name === 'undefined' ? missingRefPropType.toString() : name;
    }
    switch (definition.type) {
    case 'object':
        if(_.isEmpty(definition.properties)) {
            return 'React.PropTypes.object';
        }
        return 'React.PropTypes.shape({\n'
            + indent(_.map(definition.properties, function (property, name) {
                var keyPropType = convertDefinitionObjectToPropTypes(property, name);
                if (_.contains(definition.required || [], name)) {
                    keyPropType += '.isRequired';
                }
                return keyPropType;
            }).join(',\n')) +
        '\n})';
    case 'array':
        return 'React.PropTypes.arrayOf(' + getPropType(definition.items) + ')';
    case 'string':
        return 'React.PropTypes.string';
    case 'integer':
    case 'number':
        return 'React.PropTypes.number';
    case 'boolean':
        return 'React.PropTypes.bool';
    default:
        return unknownPropType.toString();
    }
};

var convertDefinitionObjectToPropTypes = function (definition, name) {
    return name + ': ' + getPropType(definition);
};

var modelReferences = function (definition) {
    if (definition.$ref) {
        var name = definition.$ref.match('#/definitions/(.*)')[1];
        return [name];
    }
    var deps = [];
    if (definition.type === 'object') {
        _.map(definition.properties, function (property, name) {
            deps = deps.concat(modelReferences(property));
        });
    }
    if (definition.type === 'array') {
        return modelReferences(definition.items);
    }
    return deps;
};

var formatPropType = function (name, definition) {
    return 'export const ' + name + ' = ' + definition + '\n';
};

module.exports = function (swagger) {
    var header = "import React from 'react'\n";
    console.log('\n// generated from ' + swagger.url + '\n')
    var edges = _.map(swagger.models, function (model, name) {
        return modelReferences(model.definition).map(function(m) { return [m, name] });
    });
    var names = topsort(edges.reduce(function (prev, cur) { return prev.concat(cur) },[]));
    var propTypes = _.map(names, function (name) {
        return formatPropType(name, getPropType(swagger.models[name].definition));
    });
    _.each(propTypes, function (pt) {
        console.log(pt);
    });
};
