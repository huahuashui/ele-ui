const generate = require('@babel/generator').default
const {parse} = require('@babel/parser')
const lifeCycle = [
    'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'beforeDestroy', 'destroyed'
    ]
module.exports = {
    generateFn: function (node) {
        return generate(node, {
            comments: false
        }).code
    },
    parseFn: function (nodeStr) {
        return parse(nodeStr, {
            sourceType: "module",
            plugins: [
                'typescript',
                'jsx',
                'asyncGenerators',
                'classProperties',
                ['decorators', {decoratorsBeforeExport: true}],
                'doExpressions',
                'dynamicImport',
                'exportDefaultFrom',
                'exportNamespaceFrom',
                'objectRestSpread',
                'optionalCatchBinding',
                'throwExpressions'
            ]
        })
    },
    isLifeCycle(name) {
        return lifeCycle.includes(name)
    },

}