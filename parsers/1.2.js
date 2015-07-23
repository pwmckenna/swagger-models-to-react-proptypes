var _ = require('lodash');

var indent = function (str) {
    return _.map(str.split('\n'), function (line) {
        return '    ' + line;
    }).join('\n');
}

var missingRefPropType = function(props, propName, componentName) {
    return new Error('The propType for \'' + propName + '\' could not be determined due to a missing Swagger model definition reference. Perhaps try \'React.PropTypes.any\'?');
};

var unknownPropType = function(props, propName, componentName) {
    return new Error('The propType for \'' + propName + '\' could not be determined from Swagger model definition. Perhaps try \'React.PropTypes.any\'?');
};

var getPropType = function (definition) {
    if (definition.enum) {
        return 'React.PropTypes.oneOf(' + JSON.stringify(definition.enum, null, 4) + ')';
    }
    if (definition.$ref) {
        var name = definition.$ref.match('#/definitions/(.*)')[1];
        return name === 'undefined' ? missingRefPropType : 'PropTypes.' + name;
    }

    // treat it like an object definition if there's no type specificed
    if (!definition.type) {
        return 'React.PropTypes.shape({\n'
            + indent(_.map(definition.properties, function (property, name) {
                var keyPropType = convertDefinitionObjectToPropTypes(property, name);
                if (_.contains(definition.required || [], name)) {
                    keyPropType += '.isRequired';
                }
                return keyPropType;
            }).join(',\n')) +
        '\n})';
    }

    switch (definition.type) {
    case 'array':
        return 'React.PropTypes.arrayOf(' + getPropType(definition.items) + ')';
    case 'string':
        return 'React.PropTypes.string';
    case 'integer':
        return 'React.PropTypes.number';
    case 'boolean':
        return 'React.PropTypes.bool';
    default:
        return unknownPropType;
    }
};

var convertDefinitionObjectToPropTypes = function (definition, name) {
    return name + ': ' + getPropType(definition);
};

module.exports = function (swagger) {
    var header = 'Generated PropTypes for ' + swagger.url;
    console.log('\n/**\n\n' + header + '\n' + new Array(header.length + 1).join('-') + '\n\n**/\n\n');

    console.log('var PropTypes = {\n');

    var propTypes = _.map(swagger.models, function (model, name) {
        return convertDefinitionObjectToPropTypes(model.definition, name);
    });

    console.log(indent(propTypes.join(',\n\n')));
    console.log('\n};\n\n');
};