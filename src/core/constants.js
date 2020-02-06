export const MAGNUM = '__magnum__'
export const nodeCache = []
export const rafBounceIds = []
export const _cprops = []
export const ignorekeys= [
    'toString',
    'draw',
    'then',
    'hasOwnProperty',
    'willgetprops',
    'onbeforeunload',
    'Symbol(Symbol.toStringTag)',
    'nodeType',
    'toJSON',
    'onunload',
    'willupdate',
    'didupdate',
    'didload',
    'willload',
    'isupdate'
]

//GLOBALS:
export const doc = document
export let rafBounce
export let rafRate

let runningEventInstance=-1

export const getRunningEventInstance = () => runningEventInstance
export const setRunningEventInstance = id => runningEventInstance=id


