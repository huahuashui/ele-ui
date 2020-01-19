const {generateFn, parseFn, isLifeCycle} = require('./commonutils')
const utils = require('./utils')
const traverse = require("@babel/traverse").default
let templateMap = {}

function clearAboutTs(ast) {
    //https://blog.csdn.net/weixin_34119545/article/details/91371156
    traverse(ast, {
        ClassBody(path) {
            path.traverse({
                ClassMethod(path) {
                    path.node.returnType = null;
                    path.node.accessibility = null;
                },
                Identifier(path) {
                    path.node.optional = null
                    path.node.typeAnnotation = null
                },
                AssignmentPattern(path) {
                    //函数参数类型默认参数 function(a: string = 123){} 其他的参数都属于Identifier类型
                    path.node.left.typeAnnotation = null
                },
                VariableDeclarator(path) {
                    //去除ts变量类型 const a = 123 as number
                    if(path.node.init &&path.node.init.type === 'TSAsExpression') {
                        path.node.init = path.node.init.expression;
                    }
                    //const a:number = 123
                    if(path.node.id.typeAnnotation) {
                        path.node.id.typeAnnotation = null;
                    }
                },
                AssignmentExpression(path) {
                    //去除表达式右侧类型断言  this.a = 122 as number
                    if(path.node.right.type === 'TSAsExpression') {
                        path.node.right = path.node.right.expression;
                    }
                },
                FunctionExpression(path) {
                    //出去ts函数返回类型 (): void => {}
                    path.node.returnType = null;
                },
                ObjectMethod(path) {
                    path.node.returnType = null;
                }
            })
        }
    })
}

function tranVueScript(data) {
    //每次编译重置templateMap
    templateMap = {}
    ast = parseFn(data)
    clearAboutTs(ast)
    //获取export default部分内容
    const vueExportDefaultIndex = ast.program.body.findIndex(item => item.type === 'ExportDefaultDeclaration')

    if (vueExportDefaultIndex !== -1) {
        let vueClass = ast.program.body[vueExportDefaultIndex].declaration
        let vueClassPropertyArr = vueClass.body.body

        vueClassPropertyArr.forEach(item => {
            handler(item)
        })

        const fullTsTemplate = _joinFullTsTemplate()
        const newTsAst = parseFn(fullTsTemplate)
        const output = generateFn(newTsAst)
        return output// 去除行尾分号；
            .replace(/;(?=\s*\n)/g, '')

    }
}

function handler(item) {
    if (item.decorators) {
        //@Prop @Emit @Model等
        const k = item.decorators[0].expression.callee.name
        if (k === 'Model') {
            const model = utils.model.handler(item)
            templateMap.model = (templateMap.model || '') + (model.modelTemplate || '')
            templateMap.props = (templateMap.props || '') + (model.propTemplate || '')
            return
        }
        if(k === 'Prop') {
            templateMap.props = (templateMap.props || '') + (utils.props.handler(item) || '')
            return
        }
        if (k === 'Emit') {
            templateMap.methods = (templateMap.methods || '') + (utils.emit.handler(item) || '')
            return
        }
        if(k === 'Watch') {
            //处理watch
            templateMap.watch = (templateMap.watch || '') + (utils.watch.handler(item) || '')
        }

    } else {
        //data methods computed vueLifeCycle
        if (item.type === 'ClassProperty') {
            //处理data
            templateMap.data = (templateMap.data || '') + (utils.data.handler(item) || '')
        }
        if (item.type === 'ClassMethod') {
            //处理methods和computed
            if (item.kind === 'method') {
                const result = utils.methods.handler(item)
                if(result.isLifeCycle) {
                    templateMap[result.name] = result.template
                } else {
                    templateMap.methods = (templateMap.methods || '') + (result.template || '')
                }
            }
            if (item.kind === 'get') {
                templateMap.computed = (templateMap.computed || '') + (utils.computed.handler(item) || '')
            }
        }
    }
}
function _joinFullTsTemplate() {
    let jsTemplate = ''
        Object.keys(templateMap).forEach((k) => {
            if(k === 'model') {
                jsTemplate += `${k}: \n${templateMap[k]},\n`
            } else if (k === 'data') {
                jsTemplate += `${k}(){\nreturn {\n${templateMap[k]}\n}},\n`
            } else if (isLifeCycle(k)) {
                jsTemplate += `${templateMap[k]}`
            }else {
                jsTemplate += `${k}: {\n${templateMap[k]}\n},\n`
            }
        })
    return `export default {
        ${jsTemplate}
    }`
}

module.exports = tranVueScript