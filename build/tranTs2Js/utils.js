const {generateFn, parseFn, isLifeCycle} = require('./commonutils')

function handleError(module, name) {
    console.log('----------------')
    console.log(`ts转js发生错误: ${module}=> ${name}`)
    console.log('----------------')
}
function capitalLetter(str) {
    if(!str) return
    str = str + ''
    let one = str.slice(0,1).toUpperCase()
    return one + str.slice(1)
}
module.exports = {
    props: {
        handler(item, vueOpts) {
            let propsTemplate = ''
            let propName = item.key.name
            propsTemplate = `${propName}: ${generateFn(item.decorators[0].expression.arguments[0])},\n`
            return propsTemplate
        }
    },
    watch: {
        handler(item) {
            let watchTemplate = ''
            //监听属性
            const watchProperty = generateFn(item.decorators[0].expression.arguments[0]);
            const newVal = generateFn(item.params[0])
            const oldVal = generateFn(item.params[1])
            //函数体
            const fnBody = (generateFn(item.body))
            if (generateFn(item.decorators[0].expression.arguments[1])) {
                let str = ''
                item.decorators[0].expression.arguments[1].properties.forEach(item => {
                    str = `${str}${item.key.name}:${item.value.value},\n`
                })
                watchTemplate = `[${watchProperty}]: {
                    handler: function(${newVal ? newVal : 'newVal'},${oldVal ? oldVal : 'oldVal'})${fnBody},
                    ${str}
                },\n`
            } else {
                watchTemplate = `[${watchProperty}](${newVal ? newVal : 'newVal'},${oldVal ? oldVal : 'oldVal'})${fnBody},\n`
            }
            return watchTemplate
        }
    },
    emit: {
        handler(item) {
            let emitTemplate = ''
            //@Emit()没有参数,说明emit与方法同名
            const emitName = generateFn(item.decorators[0].expression.arguments[0]) || `'${item.key.name}'`
            const methodName = item.key.name
            const fnParams = item.params
            if(fnParams) {
                let paramsStr = ''
                fnParams.forEach(data => {
                    paramsStr = paramsStr + data.name + ','
                })
                paramsStr = paramsStr.slice(0, -1)
                emitTemplate = `${methodName}(${paramsStr}){
                    this.$emit(${emitName}, ${paramsStr})
                },\n`
            } else {
                emitTemplate = `${methodName}(){
                    this.$emit(${emitName})
                },\n`
            }
            return emitTemplate

        }
    },
    model: {
        handler(item) {
            try{
                let modelTemplate = '', propTemplate = '',
                    args = item.decorators[0].expression.arguments
                modelTemplate = `{
                prop: ${generateFn(item.key)},
                event: ${generateFn(args[0])}
            }`
                let propRult = {}
                if(!args[1]) {
                    //type的值 number 或 number | boolean 等等
                    let type = item.typeAnnotation && item.typeAnnotation.typeAnnotation
                    type = generateFn(type)
                    type = type.split('|').map((val) => {
                        return capitalLetter(val)
                    })

                    propRult = type.length > 1 ? `{type: [${type}]}` : `{type: ${type}}`
                }
                propTemplate = `${generateFn(item.key)}: ${args[1] ? generateFn(args[1]) : propRult},\n`
                return {
                    modelTemplate,
                    propTemplate
                }
            } catch(e) {
                handleError('@Model', item.key.name)
            }

        }
    },
    data: {
        handler(item) {
            let dataTemplate = ''
            // console.log(item.value)
            //value存在才绑定到data
            if (item.value) {
                const k = generateFn(item.key),
                    v = item.value.type === 'TSAsExpression' ? generateFn(item.value.expression) : generateFn(item.value)
                return dataTemplate = `${k}: ${v},\n`
            }

        }
    },
    methods: {
        handler(item) {
            let template = ''
            let paramsStr = ''
            const k = generateFn(item.key),
                fn = generateFn(item)

            template = `${fn},\n`

            return {
                isLifeCycle: isLifeCycle(k),
                name: k,
                template
            }

        }
    },
    computed: {
        handler(item) {
            let computedTemplate = ''
            const fn = generateFn(item)
            computedTemplate = `${fn},\n`
            return computedTemplate
        }
    },

}