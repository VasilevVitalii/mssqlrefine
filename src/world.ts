export type TWorldKind =
    'statement' |
    'lang' |
    'query' |
    'datatype' |
    'reserved' |
    'function-configuration' |
    'function-conversion' |
    'function-cursor' |
    'function-datetime' |
    'function-graph' |
    'function-json' |
    'function-logic' |
    'function-math' |
    'function-metadata' |
    'function-security' |
    'function-aggregate' |
    'function-analytic' |
    'function-bit' |
    'function-collation' |
    'function-cryptographic' |
    'function-datetype' |
    'function-rank' |
    'function-replication' |
    'function-string' |
    'function-system' |
    'function-systemstat' |
    'function-text' |
    'function-trigger'

export type TWorldCase = 'lower' | 'upper'

export type TWorld = {
    kindCode: TWorldKind,
    text: string
}

export type TWorldKinds = {
    kindCode?: TWorldKind[],
    text: string
}

export type TWorldFilter = {
    worldKind: TWorldKind,
    worldCase: TWorldCase | undefined
}

export type TWorldMap = Map<string, TWorldKinds>

export function GetWorld(mapList: TWorldMap[], text: string): TWorldKinds {
    const len = text.length
    if (len > MAX_LEN_WORLD) return { kindCode: undefined, text: text }
    const res = mapList[len].get(text.toLowerCase())
    if (!res) {
        return { kindCode: undefined, text: text }
    }
    return { kindCode: res.kindCode, text: res.text || text }
}

export function GetWorldMapList(filter: TWorldFilter[]): TWorldMap[] {
    const res = [] as TWorldMap[]
    world.forEach(w => {
        const m = new Map<string, TWorldKinds>() as TWorldMap
        filter.forEach(fi => {
            w.filter(f => f.kindCode === fi.worldKind).forEach(l => {
                const item = m.get(l.text)
                if (item) {
                    item.kindCode.push(l.kindCode)
                } else {
                    if (fi.worldCase === 'upper') {
                        m.set(l.text, { kindCode: [l.kindCode], text: l.text.toUpperCase() })
                    } else if (fi.worldCase === 'lower') {
                        m.set(l.text, { kindCode: [l.kindCode], text: l.text.toLowerCase() })
                    } else {
                        m.set(l.text, { kindCode: [l.kindCode], text: undefined })
                    }
                }
            })
        })
        res.push(m)
    })
    return res
}

export const kindCodeList = [
    'statement',                //https://learn.microsoft.com/en-us/sql/t-sql/statements/statements?view=aps-pdw-2016-au7
    'lang',                     //https://learn.microsoft.com/en-us/sql/t-sql/language-elements/language-elements-transact-sql?view=sql-server-ver16
    'query',                    //https://learn.microsoft.com/en-us/sql/t-sql/queries/queries?view=aps-pdw-2016-au7
    'datatype',                 //https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql?view=sql-server-ver16
    'reserved',                 //https://learn.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-ver16
    'function-configuration',   //https://learn.microsoft.com/en-us/sql/t-sql/functions/configuration-functions-transact-sql?view=sql-server-ver16
    'function-conversion',      //https://learn.microsoft.com/en-us/sql/t-sql/functions/conversion-functions-transact-sql?view=sql-server-ver16
    'function-cursor',          //https://learn.microsoft.com/en-us/sql/t-sql/functions/cursor-functions-transact-sql?view=sql-server-ver16
    'function-datetime',        //https://learn.microsoft.com/en-us/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=sql-server-ver16
    'function-graph',           //https://learn.microsoft.com/en-us/sql/t-sql/functions/graph-functions-transact-sql?view=sql-server-ver16
    'function-json',            //https://learn.microsoft.com/en-us/sql/t-sql/functions/json-functions-transact-sql?view=sql-server-ver16
    'function-logic',           //https://learn.microsoft.com/en-us/sql/t-sql/functions/logical-functions-choose-transact-sql?view=sql-server-ver16
    'function-math',            //https://learn.microsoft.com/en-us/sql/t-sql/functions/mathematical-functions-transact-sql?view=sql-server-ver16
    'function-metadata',        //https://learn.microsoft.com/en-us/sql/t-sql/functions/metadata-functions-transact-sql?view=sql-server-ver16
    'function-security',        //https://learn.microsoft.com/en-us/sql/t-sql/functions/security-functions-transact-sql?view=sql-server-ver16
    'function-aggregate',       //https://learn.microsoft.com/en-us/sql/t-sql/functions/aggregate-functions-transact-sql?view=sql-server-ver16
    'function-analytic',        //https://learn.microsoft.com/en-us/sql/t-sql/functions/analytic-functions-transact-sql?view=sql-server-ver16
    'function-bit',             //https://learn.microsoft.com/en-us/sql/t-sql/functions/bit-manipulation-functions-overview?view=sql-server-ver16
    'function-collation',       //https://learn.microsoft.com/en-us/sql/t-sql/functions/collation-functions-collationproperty-transact-sql?view=sql-server-ver16
    'function-cryptographic',   //https://learn.microsoft.com/en-us/sql/t-sql/functions/cryptographic-functions-transact-sql?view=sql-server-ver16
    'function-datetype',        //https://learn.microsoft.com/en-us/sql/t-sql/functions/data-type-functions-transact-sql?view=sql-server-ver16
    'function-rank',            //https://learn.microsoft.com/en-us/sql/t-sql/functions/ranking-functions-transact-sql?view=sql-server-ver16
    'function-replication',     //https://learn.microsoft.com/en-us/sql/t-sql/functions/replication-functions-publishingservername?view=sql-server-ver16
    'function-string',          //https://learn.microsoft.com/en-us/sql/t-sql/functions/string-functions-transact-sql?view=sql-server-ver16
    'function-system',          //https://learn.microsoft.com/en-us/sql/t-sql/functions/system-functions-transact-sql?view=sql-server-ver16
    'function-systemstat',      //https://learn.microsoft.com/en-us/sql/t-sql/functions/system-statistical-functions-transact-sql?view=sql-server-ver16
    'function-text',            //https://learn.microsoft.com/en-us/sql/t-sql/functions/text-and-image-functions-textptr-transact-sql?view=sql-server-ver16
    'function-trigger',         //https://learn.microsoft.com/en-us/sql/t-sql/functions/trigger-functions-transact-sql?view=sql-server-ver16,
] as TWorldKind[]

/*
	2
	23

*/

const MAX_LEN_WORLD = 34

export const world = [
    //0
    [],
    //1
    [],
    //2
    [
        { kindCode: 'statement', text: 'as'},
        { kindCode: 'query', text: 'by'},
        { kindCode: 'query', text: 'is'},
        { kindCode: 'lang', text: 'if'},
        { kindCode: 'lang', text: 'in'},
        { kindCode: 'lang', text: 'or'},
        { kindCode: 'reserved', text: 'as' },
        { kindCode: 'reserved', text: 'by' },
        { kindCode: 'reserved', text: 'if' },
        { kindCode: 'reserved', text: 'in' },
        { kindCode: 'reserved', text: 'is' },
        { kindCode: 'reserved', text: 'of' },
        { kindCode: 'reserved', text: 'on' },
        { kindCode: 'reserved', text: 'or' },
        { kindCode: 'reserved', text: 'to' },
        { kindCode: 'function-math', text: 'pi' },
    ],
    //3
    [
        { kindCode: 'statement', text: 'key'},
        { kindCode: 'statement', text: 'set'},
        { kindCode: 'query', text: 'top'},
        { kindCode: 'lang', text: 'and'},
        { kindCode: 'lang', text: 'end'},
        { kindCode: 'lang', text: 'not'},
        { kindCode: 'lang', text: 'set'},
        { kindCode: 'lang', text: 'try'},
        { kindCode: 'lang', text: 'use'},
        { kindCode: 'datatype', text: 'bit' },
        { kindCode: 'datatype', text: 'int' },
        { kindCode: 'datatype', text: 'xml' },
        { kindCode: 'reserved', text: 'add' },
        { kindCode: 'reserved', text: 'all' },
        { kindCode: 'reserved', text: 'and' },
        { kindCode: 'reserved', text: 'any' },
        { kindCode: 'reserved', text: 'asc' },
        { kindCode: 'reserved', text: 'end' },
        { kindCode: 'reserved', text: 'for' },
        { kindCode: 'reserved', text: 'key' },
        { kindCode: 'reserved', text: 'not' },
        { kindCode: 'reserved', text: 'off' },
        { kindCode: 'reserved', text: 'set' },
        { kindCode: 'reserved', text: 'top' },
        { kindCode: 'reserved', text: 'use' },
        { kindCode: 'function-datetime', text: 'day' },
        { kindCode: 'function-logic', text: 'iif' },
        { kindCode: 'function-math', text: 'abs' },
        { kindCode: 'function-math', text: 'cos' },
        { kindCode: 'function-math', text: 'cot' },
        { kindCode: 'function-math', text: 'exp' },
        { kindCode: 'function-math', text: 'log' },
        { kindCode: 'function-math', text: 'sin' },
        { kindCode: 'function-math', text: 'tan' },
        { kindCode: 'function-aggregate', text: 'avg'},
        { kindCode: 'function-aggregate', text: 'max'},
        { kindCode: 'function-aggregate', text: 'min'},
        { kindCode: 'function-aggregate', text: 'sum'},
        { kindCode: 'function-aggregate', text: 'var'},
        { kindCode: 'function-analytic', text: 'lag'},
        { kindCode: 'function-string', text: 'len'},
        { kindCode: 'function-string', text: 'str'},
    ],
    //4
    [
        { kindCode: 'statement', text: 'data'},
        { kindCode: 'statement', text: 'deny'},
        { kindCode: 'statement', text: 'drop'},
        { kindCode: 'statement', text: 'file'},
        { kindCode: 'statement', text: 'role'},
        { kindCode: 'statement', text: 'user'},
        { kindCode: 'statement', text: 'view'},
        { kindCode: 'query', text: 'bulk'},
        { kindCode: 'query', text: 'from'},
        { kindCode: 'query', text: 'full'},
        { kindCode: 'query', text: 'into'},
        { kindCode: 'query', text: 'join'},
        { kindCode: 'query', text: 'left'},
        { kindCode: 'query', text: 'null'},
        { kindCode: 'query', text: 'over'},
        { kindCode: 'query', text: 'with'},
        { kindCode: 'lang', text: 'case'},
        { kindCode: 'lang', text: 'else'},
        { kindCode: 'lang', text: 'exec'},
        { kindCode: 'lang', text: 'kill'},
        { kindCode: 'lang', text: 'like'},
        { kindCode: 'lang', text: 'null'},
        { kindCode: 'lang', text: 'tran'},
        { kindCode: 'datatype', text: 'char' },
        { kindCode: 'datatype', text: 'date' },
        { kindCode: 'datatype', text: 'real' },
        { kindCode: 'datatype', text: 'text' },
        { kindCode: 'datatype', text: 'time' },
        { kindCode: 'reserved', text: 'bulk' },
        { kindCode: 'reserved', text: 'case' },
        { kindCode: 'reserved', text: 'dbcc' },
        { kindCode: 'reserved', text: 'deny' },
        { kindCode: 'reserved', text: 'desc' },
        { kindCode: 'reserved', text: 'disk' },
        { kindCode: 'reserved', text: 'drop' },
        { kindCode: 'reserved', text: 'dump' },
        { kindCode: 'reserved', text: 'else' },
        { kindCode: 'reserved', text: 'exec' },
        { kindCode: 'reserved', text: 'exit' },
        { kindCode: 'reserved', text: 'file' },
        { kindCode: 'reserved', text: 'from' },
        { kindCode: 'reserved', text: 'full' },
        { kindCode: 'reserved', text: 'goto' },
        { kindCode: 'reserved', text: 'into' },
        { kindCode: 'reserved', text: 'join' },
        { kindCode: 'reserved', text: 'kill' },
        { kindCode: 'reserved', text: 'left' },
        { kindCode: 'reserved', text: 'like' },
        { kindCode: 'reserved', text: 'load' },
        { kindCode: 'reserved', text: 'null' },
        { kindCode: 'reserved', text: 'open' },
        { kindCode: 'reserved', text: 'over' },
        { kindCode: 'reserved', text: 'plan' },
        { kindCode: 'reserved', text: 'proc' },
        { kindCode: 'reserved', text: 'read' },
        { kindCode: 'reserved', text: 'rule' },
        { kindCode: 'reserved', text: 'save' },
        { kindCode: 'reserved', text: 'some' },
        { kindCode: 'reserved', text: 'then' },
        { kindCode: 'reserved', text: 'tran' },
        { kindCode: 'reserved', text: 'user' },
        { kindCode: 'reserved', text: 'view' },
        { kindCode: 'reserved', text: 'when' },
        { kindCode: 'reserved', text: 'with' },
        { kindCode: 'function-conversion', text: 'cast' },
        { kindCode: 'function-datetime', text: 'year' },
        { kindCode: 'function-math', text: 'acos' },
        { kindCode: 'function-math', text: 'asin' },
        { kindCode: 'function-math', text: 'atan' },
        { kindCode: 'function-math', text: 'atn2' },
        { kindCode: 'function-math', text: 'rand' },
        { kindCode: 'function-math', text: 'sign' },
        { kindCode: 'function-math', text: 'sqrt' },
        { kindCode: 'function-aggregate', text: 'varp'},
        { kindCode: 'function-analytic', text: 'lead'},
        { kindCode: 'function-rank', text: 'rank'},
        { kindCode: 'function-string', text: 'char'},
        { kindCode: 'function-string', text: 'left'},
        { kindCode: 'function-string', text: 'trim'},
    ],
    //5
    [
        { kindCode: 'statement', text: 'alter'},
        { kindCode: 'statement', text: 'close'},
        { kindCode: 'statement', text: 'grant'},
        { kindCode: 'statement', text: 'index'},
        { kindCode: 'statement', text: 'level'},
        { kindCode: 'statement', text: 'login'},
        { kindCode: 'statement', text: 'merge'},
        { kindCode: 'statement', text: 'table'},
        { kindCode: 'query', text: 'apply'},
        { kindCode: 'query', text: 'group'},
        { kindCode: 'query', text: 'merge'},
        { kindCode: 'query', text: 'order'},
        { kindCode: 'query', text: 'outer'},
        { kindCode: 'query', text: 'pivot'},
        { kindCode: 'query', text: 'right'},
        { kindCode: 'query', text: 'where'},
        { kindCode: 'lang', text: 'begin'},
        { kindCode: 'lang', text: 'break'},
        { kindCode: 'lang', text: 'catch'},
        { kindCode: 'lang', text: 'print'},
        { kindCode: 'lang', text: 'throw'},
        { kindCode: 'lang', text: 'union'},
        { kindCode: 'lang', text: 'while'},
        { kindCode: 'datatype', text: 'float' },
        { kindCode: 'datatype', text: 'image' },
        { kindCode: 'datatype', text: 'money' },
        { kindCode: 'datatype', text: 'nchar' },
        { kindCode: 'datatype', text: 'ntext' },
        { kindCode: 'reserved', text: 'alter' },
        { kindCode: 'reserved', text: 'begin' },
        { kindCode: 'reserved', text: 'break' },
        { kindCode: 'reserved', text: 'check' },
        { kindCode: 'reserved', text: 'close' },
        { kindCode: 'reserved', text: 'cross' },
        { kindCode: 'reserved', text: 'fetch' },
        { kindCode: 'reserved', text: 'grant' },
        { kindCode: 'reserved', text: 'group' },
        { kindCode: 'reserved', text: 'index' },
        { kindCode: 'reserved', text: 'inner' },
        { kindCode: 'reserved', text: 'merge' },
        { kindCode: 'reserved', text: 'order' },
        { kindCode: 'reserved', text: 'outer' },
        { kindCode: 'reserved', text: 'pivot' },
        { kindCode: 'reserved', text: 'print' },
        { kindCode: 'reserved', text: 'right' },
        { kindCode: 'reserved', text: 'table' },
        { kindCode: 'reserved', text: 'union' },
        { kindCode: 'reserved', text: 'where' },
        { kindCode: 'reserved', text: 'while' },
        { kindCode: 'function-conversion', text: 'parse' },
        { kindCode: 'function-datetime', text: 'month' },
        { kindCode: 'function-math', text: 'floor' },
        { kindCode: 'function-math', text: 'log10' },
        { kindCode: 'function-math', text: 'power' },
        { kindCode: 'function-math', text: 'round' },
        { kindCode: 'function-metadata', text: 'db_id' },
        { kindCode: 'function-aggregate', text: 'count'},
        { kindCode: 'function-aggregate', text: 'stdev'},
        { kindCode: 'function-rank', text: 'ntile'},
        { kindCode: 'function-string', text: 'ascii'},
        { kindCode: 'function-string', text: 'lower'},
        { kindCode: 'function-string', text: 'ltrim'},
        { kindCode: 'function-string', text: 'nchar'},
        { kindCode: 'function-string', text: 'right'},
        { kindCode: 'function-string', text: 'rtrim'},
        { kindCode: 'function-string', text: 'space'},
        { kindCode: 'function-string', text: 'stuff'},
        { kindCode: 'function-string', text: 'upper'},
        { kindCode: 'function-system', text: 'newid'},
    ],
    //6
    [
        { kindCode: 'statement', text: 'backup'},
        { kindCode: 'statement', text: 'create'},
        { kindCode: 'statement', text: 'delete'},
        { kindCode: 'statement', text: 'format'},
        { kindCode: 'statement', text: 'insert'},
        { kindCode: 'statement', text: 'master'},
        { kindCode: 'statement', text: 'remote'},
        { kindCode: 'statement', text: 'rename'},
        { kindCode: 'statement', text: 'revoke'},
        { kindCode: 'statement', text: 'schema'},
        { kindCode: 'statement', text: 'scoped'},
        { kindCode: 'statement', text: 'select'},
        { kindCode: 'statement', text: 'server'},
        { kindCode: 'statement', text: 'source'},
        { kindCode: 'statement', text: 'update'},
        { kindCode: 'query', text: 'delete'},
        { kindCode: 'query', text: 'having'},
        { kindCode: 'query', text: 'insert'},
        { kindCode: 'query', text: 'option'},
        { kindCode: 'query', text: 'select'},
        { kindCode: 'query', text: 'update'},
        { kindCode: 'lang', text: 'commit'},
        { kindCode: 'lang', text: 'create'},
        { kindCode: 'lang', text: 'except'},
        { kindCode: 'lang', text: 'exists'},
        { kindCode: 'lang', text: 'nullif'},
        { kindCode: 'datatype', text: 'bigint' },
        { kindCode: 'datatype', text: 'binary' },
        { kindCode: 'datatype', text: 'cursor' },
        { kindCode: 'reserved', text: 'backup' },
        { kindCode: 'reserved', text: 'browse' },
        { kindCode: 'reserved', text: 'column' },
        { kindCode: 'reserved', text: 'commit' },
        { kindCode: 'reserved', text: 'create' },
        { kindCode: 'reserved', text: 'cursor' },
        { kindCode: 'reserved', text: 'delete' },
        { kindCode: 'reserved', text: 'double' },
        { kindCode: 'reserved', text: 'errlvl' },
        { kindCode: 'reserved', text: 'escape' },
        { kindCode: 'reserved', text: 'except' },
        { kindCode: 'reserved', text: 'exists' },
        { kindCode: 'reserved', text: 'having' },
        { kindCode: 'reserved', text: 'insert' },
        { kindCode: 'reserved', text: 'lineno' },
        { kindCode: 'reserved', text: 'nullif' },
        { kindCode: 'reserved', text: 'option' },
        { kindCode: 'reserved', text: 'public' },
        { kindCode: 'reserved', text: 'return' },
        { kindCode: 'reserved', text: 'revert' },
        { kindCode: 'reserved', text: 'revoke' },
        { kindCode: 'reserved', text: 'schema' },
        { kindCode: 'reserved', text: 'select' },
        { kindCode: 'reserved', text: 'unique' },
        { kindCode: 'reserved', text: 'update' },
        { kindCode: 'reserved', text: 'values' },
        { kindCode: 'reserved', text: 'within' },
        { kindCode: 'function-conversion', text: 'format' },
        { kindCode: 'function-configuration', text: '@@dbts' },
        { kindCode: 'function-configuration', text: '@@spid' },
        { kindCode: 'function-datetime', text: 'isdate' },
        { kindCode: 'function-json', text: 'isjson' },
        { kindCode: 'function-logic', text: 'choose' },
        { kindCode: 'function-math', text: 'square' },
        { kindCode: 'function-aggregate', text: 'stdevp'},
        { kindCode: 'function-cryptographic', text: 'key_id'},
        { kindCode: 'function-string', text: 'concat'},
        { kindCode: 'function-string', text: 'format'},
        { kindCode: 'function-system', text: 'isnull'},
        { kindCode: 'function-systemstat', text: '@@idle'},
    ],
    //7
    [
        { kindCode: 'statement', text: 'collate'},
        { kindCode: 'statement', text: 'fmtonly'},
        { kindCode: 'statement', text: 'restore'},
        { kindCode: 'query', text: 'unpivot'},
        { kindCode: 'lang', text: 'between'},
        { kindCode: 'lang', text: 'collate'},
        { kindCode: 'lang', text: 'declare'},
        { kindCode: 'lang', text: 'execute'},
        { kindCode: 'lang', text: 'session'},
        { kindCode: 'lang', text: 'unknown'},
        { kindCode: 'datatype', text: 'decimal' },
        { kindCode: 'datatype', text: 'numeric' },
        { kindCode: 'datatype', text: 'sysname' },
        { kindCode: 'datatype', text: 'tinyint' },
        { kindCode: 'datatype', text: 'varchar' },
        { kindCode: 'reserved', text: 'between' },
        { kindCode: 'reserved', text: 'cascade' },
        { kindCode: 'reserved', text: 'collate' },
        { kindCode: 'reserved', text: 'compute' },
        { kindCode: 'reserved', text: 'convert' },
        { kindCode: 'reserved', text: 'current' },
        { kindCode: 'reserved', text: 'declare' },
        { kindCode: 'reserved', text: 'default' },
        { kindCode: 'reserved', text: 'execute' },
        { kindCode: 'reserved', text: 'foreign' },
        { kindCode: 'reserved', text: 'nocheck' },
        { kindCode: 'reserved', text: 'offsets' },
        { kindCode: 'reserved', text: 'openxml' },
        { kindCode: 'reserved', text: 'percent' },
        { kindCode: 'reserved', text: 'primary' },
        { kindCode: 'reserved', text: 'restore' },
        { kindCode: 'reserved', text: 'setuser' },
        { kindCode: 'reserved', text: 'trigger' },
        { kindCode: 'reserved', text: 'tsequal' },
        { kindCode: 'reserved', text: 'unpivot' },
        { kindCode: 'reserved', text: 'varying' },
        { kindCode: 'reserved', text: 'waitfor' },
        { kindCode: 'function-conversion', text: 'convert' },
        { kindCode: 'function-datetime', text: 'dateadd' },
        { kindCode: 'function-datetime', text: 'eomonth' },
        { kindCode: 'function-datetime', text: 'getdate' },
        { kindCode: 'function-math', text: 'ceiling' },
        { kindCode: 'function-math', text: 'degrees' },
        { kindCode: 'function-math', text: 'radians' },
        { kindCode: 'function-metadata', text: 'db_name' },
        { kindCode: 'function-metadata', text: 'file_id' },
        { kindCode: 'function-metadata', text: 'type_id' },
        { kindCode: 'function-metadata', text: 'version' },
        { kindCode: 'function-security', text: 'user_id' },
        { kindCode: 'function-bit', text: 'get_bit'},
        { kindCode: 'function-bit', text: 'set_bit'},
        { kindCode: 'function-string', text: 'replace'},
        { kindCode: 'function-string', text: 'reverse'},
        { kindCode: 'function-string', text: 'soundex'},
        { kindCode: 'function-string', text: 'unicode'},
        { kindCode: 'function-system', text: '@@error'},
        { kindCode: 'function-system', text: 'host_id'},
        { kindCode: 'function-text', text: 'textptr'},
    ],
    //8
    [
        { kindCode: 'statement', text: 'database'},
        { kindCode: 'statement', text: 'external'},
        { kindCode: 'statement', text: 'function'},
        { kindCode: 'statement', text: 'rowcount'},
        { kindCode: 'statement', text: 'textsize'},
        { kindCode: 'statement', text: 'truncate'},
        { kindCode: 'query', text: 'readtext'},
        { kindCode: 'lang', text: 'coalesce'},
        { kindCode: 'lang', text: 'rollback'},
        { kindCode: 'datatype', text: 'datetime' },
        { kindCode: 'datatype', text: 'geometry' },
        { kindCode: 'datatype', text: 'nvarchar' },
        { kindCode: 'datatype', text: 'smallint' },
        { kindCode: 'reserved', text: 'coalesce' },
        { kindCode: 'reserved', text: 'contains' },
        { kindCode: 'reserved', text: 'continue' },
        { kindCode: 'reserved', text: 'database' },
        { kindCode: 'reserved', text: 'distinct' },
        { kindCode: 'reserved', text: 'external' },
        { kindCode: 'reserved', text: 'freetext' },
        { kindCode: 'reserved', text: 'function' },
        { kindCode: 'reserved', text: 'holdlock' },
        { kindCode: 'reserved', text: 'identity' },
        { kindCode: 'reserved', text: 'national' },
        { kindCode: 'reserved', text: 'readtext' },
        { kindCode: 'reserved', text: 'restrict' },
        { kindCode: 'reserved', text: 'rollback' },
        { kindCode: 'reserved', text: 'rowcount' },
        { kindCode: 'reserved', text: 'shutdown' },
        { kindCode: 'reserved', text: 'textsize' },
        { kindCode: 'reserved', text: 'truncate' },
        { kindCode: 'function-configuration', text: '@@langid' },
        { kindCode: 'function-conversion', text: 'try_cast' },
        { kindCode: 'function-datetime', text: 'datediff' },
        { kindCode: 'function-datetime', text: 'datename' },
        { kindCode: 'function-datetime', text: 'datepart' },
        { kindCode: 'function-datetime', text: 'language' },
        { kindCode: 'function-metadata', text: '@@procid' },
        { kindCode: 'function-metadata', text: 'app_name' },
        { kindCode: 'function-metadata', text: 'col_name' },
        { kindCode: 'function-security', text: 'suser_id' },
        { kindCode: 'function-aggregate', text: 'grouping'},
        { kindCode: 'function-cryptographic', text: 'key_guid'},
        { kindCode: 'function-cryptographic', text: 'key_name'},
        { kindCode: 'function-datetype', text: 'identity'},
        { kindCode: 'function-string', text: 'patindex'},
        { kindCode: 'function-system', text: 'checksum'},
        { kindCode: 'function-system', text: 'compress'},
    ],
    //9
    [
        { kindCode: 'statement', text: 'datefirst'},
        { kindCode: 'statement', text: 'isolation'},
        { kindCode: 'statement', text: 'parseonly'},
        { kindCode: 'statement', text: 'procedure'},
        { kindCode: 'query', text: 'partition'},
        { kindCode: 'query', text: 'writetext'},
        { kindCode: 'lang', text: 'intersect'},
        { kindCode: 'lang', text: 'raiserror'},
        { kindCode: 'datatype', text: 'datetime2' },
        { kindCode: 'datatype', text: 'geography' },
        { kindCode: 'datatype', text: 'timestamp' },
        { kindCode: 'datatype', text: 'varbinary' },
        { kindCode: 'reserved', text: 'clustered' },
        { kindCode: 'reserved', text: 'intersect' },
        { kindCode: 'reserved', text: 'openquery' },
        { kindCode: 'reserved', text: 'precision' },
        { kindCode: 'reserved', text: 'procedure' },
        { kindCode: 'reserved', text: 'raiserror' },
        { kindCode: 'reserved', text: 'writetext' },
        { kindCode: 'function-configuration', text: '@@options' },
        { kindCode: 'function-configuration', text: '@@version' },
        { kindCode: 'function-conversion', text: 'try_parse' },
        { kindCode: 'function-datetime', text: 'datefirst' },
        { kindCode: 'function-datetime', text: 'datetrunc' },
        { kindCode: 'function-metadata', text: 'file_idex' },
        { kindCode: 'function-metadata', text: 'file_name' },
        { kindCode: 'function-metadata', text: 'index_col' },
        { kindCode: 'function-metadata', text: 'object_id' },
        { kindCode: 'function-metadata', text: 'parsename' },
        { kindCode: 'function-metadata', text: 'schema_id' },
        { kindCode: 'function-metadata', text: 'type_name' },
        { kindCode: 'function-security', text: 'is_member' },
        { kindCode: 'function-security', text: 'schema_id' },
        { kindCode: 'function-security', text: 'suser_sid' },
        { kindCode: 'function-security', text: 'user_name' },
        { kindCode: 'function-aggregate', text: 'count_big'},
        { kindCode: 'function-analytic', text: 'cume_dist'},
        { kindCode: 'function-bit', text: 'bit_count'},
        { kindCode: 'function-string', text: 'charindex'},
        { kindCode: 'function-string', text: 'concat_ws'},
        { kindCode: 'function-string', text: 'quotename'},
        { kindCode: 'function-string', text: 'replicate'},
        { kindCode: 'function-string', text: 'substring'},
        { kindCode: 'function-string', text: 'translate'},
        { kindCode: 'function-system', text: 'host_name'},
        { kindCode: 'function-system', text: 'isnumeric'},
        { kindCode: 'function-systemstat', text: '@@io_busy'},
        { kindCode: 'function-text', text: 'textvalid'},
        { kindCode: 'function-trigger', text: 'eventdata'},
    ],
    //10
    [
        { kindCode: 'statement', text: 'ansi_nulls'},
        { kindCode: 'statement', text: 'arithabort'},
        { kindCode: 'statement', text: 'credential'},
        { kindCode: 'statement', text: 'dateformat'},
        { kindCode: 'statement', text: 'encryption'},
        { kindCode: 'statement', text: 'statistics'},
        { kindCode: 'statement', text: 'xact_abort'},
        { kindCode: 'query', text: 'updatetext'},
        { kindCode: 'datatype', text: 'rowversion' },
        { kindCode: 'datatype', text: 'smallmoney' },
        { kindCode: 'reserved', text: 'checkpoint' },
        { kindCode: 'reserved', text: 'constraint' },
        { kindCode: 'reserved', text: 'deallocate' },
        { kindCode: 'reserved', text: 'fillfactor' },
        { kindCode: 'reserved', text: 'openrowset' },
        { kindCode: 'reserved', text: 'references' },
        { kindCode: 'reserved', text: 'rowguidcol' },
        { kindCode: 'reserved', text: 'statistics' },
        { kindCode: 'reserved', text: 'updatetext' },
        { kindCode: 'function-configuration', text: '@@language' },
        { kindCode: 'function-configuration', text: '@@textsize' },
        { kindCode: 'function-datetime', text: '@@language' },
        { kindCode: 'function-datetime', text: 'dateformat' },
        { kindCode: 'function-datetime', text: 'getutcdate' },
        { kindCode: 'function-json', text: 'json_query' },
        { kindCode: 'function-json', text: 'json_value' },
        { kindCode: 'function-metadata', text: 'col_length' },
        { kindCode: 'function-metadata', text: 'stats_date' },
        { kindCode: 'function-security', text: 'pwdcompare' },
        { kindCode: 'function-security', text: 'pwdencrypt' },
        { kindCode: 'function-security', text: 'suser_name' },
        { kindCode: 'function-aggregate', text: 'string_agg'},
        { kindCode: 'function-analytic', text: 'last_value'},
        { kindCode: 'function-bit', text: 'left_shift'},
        { kindCode: 'function-datetype', text: 'datalength'},
        { kindCode: 'function-datetype', text: 'ident_incr'},
        { kindCode: 'function-datetype', text: 'ident_seed'},
        { kindCode: 'function-rank', text: 'dense_rank'},
        { kindCode: 'function-rank', text: 'row_number'},
        { kindCode: 'function-string', text: 'difference'},
        { kindCode: 'function-string', text: 'string_agg'},
        { kindCode: 'function-system', text: '$partition'},
        { kindCode: 'function-system', text: '@@identity'},
        { kindCode: 'function-system', text: '@@rowcount'},
        { kindCode: 'function-system', text: 'decompress'},
        { kindCode: 'function-system', text: 'error_line'},
        { kindCode: 'function-system', text: 'session_id'},
        { kindCode: 'function-system', text: 'xact_state'},
        { kindCode: 'function-systemstat', text: '@@cpu_busy'},
    ],
    //11
    [
        { kindCode: 'statement', text: 'arithignore'},
        { kindCode: 'statement', text: 'bulk insert'},
        { kindCode: 'statement', text: 'certificate'},
        { kindCode: 'statement', text: 'columnstore'},
        { kindCode: 'statement', text: 'transaction'},
        { kindCode: 'lang', text: 'diagnostics'},
        { kindCode: 'lang', text: 'transaction'},
        { kindCode: 'datatype', text: 'hierarchyid' },
        { kindCode: 'datatype', text: 'sql_variant' },
        { kindCode: 'reserved', text: 'distributed' },
        { kindCode: 'reserved', text: 'identitycol' },
        { kindCode: 'reserved', text: 'reconfigure' },
        { kindCode: 'reserved', text: 'replication' },
        { kindCode: 'reserved', text: 'system_user' },
        { kindCode: 'reserved', text: 'tablesample' },
        { kindCode: 'reserved', text: 'transaction' },
        { kindCode: 'reserved', text: 'try_convert' },
        { kindCode: 'function-configuration', text: '@@datefirst' },
        { kindCode: 'function-configuration', text: '@@nestlevel' },
        { kindCode: 'function-configuration', text: '@@remserver' },
        { kindCode: 'function-conversion', text: 'try_convert' },
        { kindCode: 'function-datetime', text: '@@datefirst' },
        { kindCode: 'function-datetime', text: 'date_bucket' },
        { kindCode: 'function-datetime', text: 'sysdatetime' },
        { kindCode: 'function-json', text: 'json_modify' },
        { kindCode: 'function-metadata', text: 'object_name' },
        { kindCode: 'function-metadata', text: 'schema_name' },
        { kindCode: 'function-security', text: 'certencoded' },
        { kindCode: 'function-security', text: 'permissions' },
        { kindCode: 'function-security', text: 'schema_name' },
        { kindCode: 'function-security', text: 'suser_sname' },
        { kindCode: 'function-security', text: 'system_user' },
        { kindCode: 'function-aggregate', text: 'grouping_id'},
        { kindCode: 'function-analytic', text: 'first_value'},
        { kindCode: 'function-bit', text: 'right_shift'},
        { kindCode: 'function-system', text: '@@trancount'},
        { kindCode: 'function-system', text: 'error_state'},
        { kindCode: 'function-system', text: 'getansinull'},
        { kindCode: 'function-systemstat', text: '@@pack_sent'},
        { kindCode: 'function-systemstat', text: '@@timeticks'},
    ],
    //12
    [
        { kindCode: 'statement', text: 'ansi_padding'},
        { kindCode: 'statement', text: 'lock_timeout'},
        { kindCode: 'reserved', text: 'current_date' },
        { kindCode: 'reserved', text: 'current_time' },
        { kindCode: 'reserved', text: 'current_user' },
        { kindCode: 'reserved', text: 'nonclustered' },
        { kindCode: 'reserved', text: 'session_user' },
        { kindCode: 'function-configuration', text: '@@servername' },
        { kindCode: 'function-datetime', text: 'datediff_big' },
        { kindCode: 'function-datetime', text: 'switchoffset' },
        { kindCode: 'function-metadata', text: 'applock_mode' },
        { kindCode: 'function-metadata', text: 'applock_test' },
        { kindCode: 'function-metadata', text: 'filegroup_id' },
        { kindCode: 'function-metadata', text: 'fileproperty' },
        { kindCode: 'function-metadata', text: 'typeproperty' },
        { kindCode: 'function-security', text: 'current_user' },
        { kindCode: 'function-security', text: 'session_user' },
        { kindCode: 'function-aggregate', text: 'checksum_agg'},
        { kindCode: 'function-analytic', text: 'percent_rank'},
        { kindCode: 'function-cryptographic', text: 'decryptbykey'},
        { kindCode: 'function-cryptographic', text: 'encryptbykey'},
        { kindCode: 'function-string', text: 'string_split'},
        { kindCode: 'function-system', text: 'context_info'},
        { kindCode: 'function-system', text: 'error_number'},
        { kindCode: 'function-system', text: 'rowcount_big'},
        { kindCode: 'function-systemstat', text: '@@total_read'},
    ],
    //13
    [
        { kindCode: 'statement', text: 'ansi_defaults'},
        { kindCode: 'statement', text: 'ansi_warnings'},
        { kindCode: 'statement', text: 'authorization'},
        { kindCode: 'datatype', text: 'smalldatetime' },
        { kindCode: 'reserved', text: 'authorization' },
        { kindCode: 'reserved', text: 'containstable' },
        { kindCode: 'reserved', text: 'freetexttable' },
        { kindCode: 'reserved', text: 'securityaudit' },
        { kindCode: 'function-configuration', text: '@@servicename' },
        { kindCode: 'function-cursor', text: '@@cursor_rows' },
        { kindCode: 'function-cursor', text: 'cursor_status' },
        { kindCode: 'function-datetime', text: 'datefromparts' },
        { kindCode: 'function-datetime', text: 'timefromparts' },
        { kindCode: 'function-metadata', text: 'indexproperty' },
        { kindCode: 'function-security', text: 'is_rolemember' },
        { kindCode: 'function-security', text: 'loginproperty' },
        { kindCode: 'function-datetype', text: 'ident_current'},
        { kindCode: 'function-string', text: 'string_escape'},
        { kindCode: 'function-system', text: 'error_message'},
        { kindCode: 'function-system', text: 'formatmessage'},
        { kindCode: 'function-systemstat', text: '@@connections'},
        { kindCode: 'function-systemstat', text: '@@total_write'},
    ],
    //14
    [
        { kindCode: 'statement', text: 'enable trigger'},
        { kindCode: 'statement', text: 'truncate table'},
        { kindCode: 'datatype', text: 'datetimeoffset' },
        { kindCode: 'reserved', text: 'opendatasource' },
        { kindCode: 'function-configuration', text: '@@lock_timeout' },
        { kindCode: 'function-cursor', text: '@@fetch_status' },
        { kindCode: 'function-datetime', text: 'sysutcdatetime' },
        { kindCode: 'function-metadata', text: 'columnproperty' },
        { kindCode: 'function-metadata', text: 'filegroup_name' },
        { kindCode: 'function-metadata', text: 'next value for' },
        { kindCode: 'function-metadata', text: 'objectproperty' },
        { kindCode: 'function-metadata', text: 'scope_identity' },
        { kindCode: 'function-metadata', text: 'serverproperty' },
        { kindCode: 'function-security', text: 'certprivatekey' },
        { kindCode: 'function-security', text: 'original_login' },
        { kindCode: 'function-cryptographic', text: 'symkeyproperty'},
        { kindCode: 'function-system', text: 'error_severity'},
        { kindCode: 'function-systemstat', text: '@@total_errors'},
    ],
    //15
    [
        { kindCode: 'statement', text: 'disable trigger'},
        { kindCode: 'reserved', text: 'identity_insert' },
        { kindCode: 'function-configuration', text: '@@max_precision' },
        { kindCode: 'function-analytic', text: 'percentile_cont'},
        { kindCode: 'function-analytic', text: 'percentile_disc'},
        { kindCode: 'function-system', text: '@@pack_received'},
        { kindCode: 'function-system', text: 'binary_checksum'},
        { kindCode: 'function-system', text: 'error_procedure'},
        { kindCode: 'function-system', text: 'newsequentialid'},
        { kindCode: 'function-system', text: 'session_context'},
        { kindCode: 'function-systemstat', text: '@@pack_received'},
        { kindCode: 'function-systemstat', text: '@@packet_errors'},
        { kindCode: 'function-trigger', text: 'columns_updated'},
    ],
    //16
    [
        { kindCode: 'datatype', text: 'uniqueidentifier' },
        { kindCode: 'function-datetime', text: 'todatetimeoffset' },
        { kindCode: 'function-json', text: 'json_path_exists' },
        { kindCode: 'function-metadata', text: 'assemblyproperty' },
        { kindCode: 'function-metadata', text: 'objectpropertyex' },
        { kindCode: 'function-metadata', text: 'original_db_name' },
        { kindCode: 'function-security', text: 'is_srvrolemember' },
        { kindCode: 'function-collation', text: 'tertiary_weights'},
    ],
    //17
    [
        { kindCode: 'statement', text: 'ansi_null_dflt_on'},
        { kindCode: 'statement', text: 'quoted_identifier'},
        { kindCode: 'statement', text: 'update statistics'},
        { kindCode: 'reserved', text: 'current_timestamp' },
        { kindCode: 'function-configuration', text: '@@max_connections' },
        { kindCode: 'function-datetime', text: 'current_timestamp' },
        { kindCode: 'function-datetime', text: 'datetimefromparts' },
        { kindCode: 'function-datetime', text: 'sysdatetimeoffset' },
        { kindCode: 'function-metadata', text: 'filegroupproperty' },
        { kindCode: 'function-metadata', text: 'indexkey_property' },
        { kindCode: 'function-metadata', text: 'object_definition' },
        { kindCode: 'function-security', text: 'has_perms_by_name' },
        { kindCode: 'function-collation', text: 'collationproperty'},
        { kindCode: 'function-trigger', text: 'trigger_nestlevel'},
    ],
    //18
    [
        { kindCode: 'statement', text: 'ansi_null_dflt_off'},
        { kindCode: 'statement', text: 'connection_options'},
        { kindCode: 'statement', text: 'numeric_roundabort'},
        { kindCode: 'function-datetime', text: 'datetime2fromparts' },
        { kindCode: 'function-graph', text: 'edge_id_from_parts' },
        { kindCode: 'function-graph', text: 'node_id_from_parts' },
        { kindCode: 'function-metadata', text: 'databasepropertyex' },
        { kindCode: 'function-metadata', text: 'object_schema_name' },
        { kindCode: 'function-system', text: 'connectionproperty'},
        { kindCode: 'function-system', text: 'current_request_id'},
    ],
    //19
    [
        { kindCode: 'function-cryptographic', text: 'decryptbypassphrase'},
        { kindCode: 'function-cryptographic', text: 'encryptbypassphrase'},
    ],
    //20
    [
        { kindCode: 'function-datetype', text: 'sql_variant_property'},
        { kindCode: 'function-replication', text: 'publishingservername'},
    ],
    //21
    [
        { kindCode: 'statement', text: 'implicit_transactions'},
        { kindCode: 'function-graph', text: 'graph_id_from_edge_id' },
        { kindCode: 'function-graph', text: 'graph_id_from_node_id' },
        { kindCode: 'function-metadata', text: 'database_principal_id' },
        { kindCode: 'function-security', text: 'database_principal_id' },
        { kindCode: 'function-aggregate', text: 'approx_count_distinct'},
        { kindCode: 'function-system', text: 'min_active_rowversion'},
    ],
    //22
    [
        { kindCode: 'reserved', text: 'semantickeyphrasetable' },
        { kindCode: 'function-datetime', text: 'smalldatetimefromparts' },
        { kindCode: 'function-graph', text: 'object_id_from_edge_id' },
        { kindCode: 'function-graph', text: 'object_id_from_node_id' },
        { kindCode: 'function-system', text: 'current_transaction_id'},
    ],
    //23
    [
        { kindCode: 'statement', text: 'concat_null_yields_null'},
        { kindCode: 'reserved', text: 'semanticsimilaritytable' },
        { kindCode: 'function-datetime', text: 'datetimeoffsetfromparts' },
        { kindCode: 'function-metadata', text: 'fulltextcatalogproperty' },
        { kindCode: 'function-metadata', text: 'fulltextserviceproperty' },
        { kindCode: 'function-cryptographic', text: 'decryptbykeyautoasymkey'},
    ],
    //24
    [

    ],
    //25
    [

    ],
    //26
    [

    ],
    //27
    [

    ],
    //28
    [

    ],
    //29
    [

    ],
    //30
    [
        { kindCode: 'reserved', text: 'semanticsimilaritydetailstable' },
    ],
    //31
    [

    ],
    //32
    [

    ],
    //33
    [

    ],
    //34
    [
        { kindCode: 'function-system', text: 'get_filestream_transaction_context'},
    ],

] as TWorld[][]

