const _ = require('lodash');

const indent = function (str) {
    return _.map(str.split('\n'), function (line) {
        return '    ' + line;
    }).join('\n');
};

const missingRefPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined due to a missing Swagger model definition reference');
};

const unknownPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined from Swagger model definition');
};

const getPropType = function (definition) {
    if (definition.enum) {
        return 'PropTypes.oneOf(' + JSON.stringify(definition.enum, null, 4) + ')';
    }
    if (definition.$ref) {
        const name = definition.$ref.match('#/definitions/(.*)')[1];
        return name === 'undefined' ? missingRefPropType.toString() : 'PropTypes.' + name;
    }
    switch (definition.type) {
    case 'object':
        if(_.isEmpty(definition.properties)) {
            return 'PropTypes.object';
        }
        return 'PropTypes.shape({\n'
            + indent(_.map(definition.properties, function (property, name) {
                let keyPropType = convertDefinitionObjectToPropTypes(property, name);
                if (_.contains(definition.required || [], name)) {
                    keyPropType += '.isRequired';
                }
                return keyPropType;
            }).join(',\n')) +
        '\n})';
    case 'array':
        return 'PropTypes.arrayOf(' + getPropType(definition.items) + ')';
    case 'string':
        if (definition.format === 'date' || definition.format === 'date-time') {
            return 'PropTypes.date';
        } else {
            return 'PropTypes.string';
        }
    case 'integer':
    case 'number':
        return 'PropTypes.number';
    case 'boolean':
        return 'PropTypes.bool';
    default:
        return unknownPropType.toString();
    }
};

const exportDefinition = function (definition, name) {
    return `export const ${name} = ${getPropType(definition)};`;
};

const convertDefinitionObjectToPropTypes = function (definition, name) {
    return name + ': ' + getPropType(definition);
};

module.exports = function (swagger) {
    const header = 'Generated PropTypes for ' + swagger.url;
    console.log('/**\n' + header + new Array(header.length + 1).join('-') + '\n**/\n');

    console.log('import PropTypes from "prop-types";\n\n');

    const propTypes = _.map(swagger.spec.definitions, function (model, name) {
        return exportDefinition(model, name);
    });

    console.log(propTypes.join('\n\n'));
};
