export type TWorldKindCode = 'datatype' | 'reserved'

export type TWorldItem = {
    kindCode: TWorldKindCode,
    text: string
}

export function GetWorld(text: string): TWorldItem {
    const len = text.length
    if (len > MAX_LEN_WORLD) return {kindCode: undefined, text: text}
    return world[len].find(f => f.text === text.toLowerCase()) || {kindCode: undefined, text: text}
}

const MAX_LEN_WORLD = 30

const world = [
    //0
    [],
    //1
    [],
    //2
    [
        {kindCode: 'reserved', text: 'as'},
        {kindCode: 'reserved', text: 'by'},
        {kindCode: 'reserved', text: 'if'},
        {kindCode: 'reserved', text: 'in'},
        {kindCode: 'reserved', text: 'is'},
        {kindCode: 'reserved', text: 'of'},
        {kindCode: 'reserved', text: 'on'},
        {kindCode: 'reserved', text: 'or'},
        {kindCode: 'reserved', text: 'to'},
    ],
    //3
    [
        {kindCode: 'datatype', text: 'bit'},
        {kindCode: 'datatype', text: 'int'},
        {kindCode: 'datatype', text: 'xml'},
        {kindCode: 'reserved', text: 'add'},
        {kindCode: 'reserved', text: 'all'},
        {kindCode: 'reserved', text: 'and'},
        {kindCode: 'reserved', text: 'any'},
        {kindCode: 'reserved', text: 'asc'},
        {kindCode: 'reserved', text: 'end'},
        {kindCode: 'reserved', text: 'for'},
        {kindCode: 'reserved', text: 'key'},
        {kindCode: 'reserved', text: 'not'},
        {kindCode: 'reserved', text: 'off'},
        {kindCode: 'reserved', text: 'set'},
        {kindCode: 'reserved', text: 'top'},
        {kindCode: 'reserved', text: 'use'},
    ],
    //4
    [
        {kindCode: 'datatype', text: 'char'},
        {kindCode: 'datatype', text: 'date'},
        {kindCode: 'datatype', text: 'real'},
        {kindCode: 'datatype', text: 'text'},
        {kindCode: 'datatype', text: 'time'},
        {kindCode: 'reserved', text: 'bulk'},
        {kindCode: 'reserved', text: 'case'},
        {kindCode: 'reserved', text: 'dbcc'},
        {kindCode: 'reserved', text: 'deny'},
        {kindCode: 'reserved', text: 'desc'},
        {kindCode: 'reserved', text: 'disk'},
        {kindCode: 'reserved', text: 'drop'},
        {kindCode: 'reserved', text: 'dump'},
        {kindCode: 'reserved', text: 'else'},
        {kindCode: 'reserved', text: 'exec'},
        {kindCode: 'reserved', text: 'exit'},
        {kindCode: 'reserved', text: 'file'},
        {kindCode: 'reserved', text: 'from'},
        {kindCode: 'reserved', text: 'full'},
        {kindCode: 'reserved', text: 'goto'},
        {kindCode: 'reserved', text: 'into'},
        {kindCode: 'reserved', text: 'join'},
        {kindCode: 'reserved', text: 'kill'},
        {kindCode: 'reserved', text: 'left'},
        {kindCode: 'reserved', text: 'like'},
        {kindCode: 'reserved', text: 'load'},
        {kindCode: 'reserved', text: 'null'},
        {kindCode: 'reserved', text: 'open'},
        {kindCode: 'reserved', text: 'over'},
        {kindCode: 'reserved', text: 'plan'},
        {kindCode: 'reserved', text: 'proc'},
        {kindCode: 'reserved', text: 'read'},
        {kindCode: 'reserved', text: 'rule'},
        {kindCode: 'reserved', text: 'save'},
        {kindCode: 'reserved', text: 'some'},
        {kindCode: 'reserved', text: 'then'},
        {kindCode: 'reserved', text: 'tran'},
        {kindCode: 'reserved', text: 'user'},
        {kindCode: 'reserved', text: 'view'},
        {kindCode: 'reserved', text: 'when'},
        {kindCode: 'reserved', text: 'with'},
    ],
    //5
    [
        {kindCode: 'datatype', text: 'float'},
        {kindCode: 'datatype', text: 'image'},
        {kindCode: 'datatype', text: 'money'},
        {kindCode: 'datatype', text: 'nchar'},
        {kindCode: 'datatype', text: 'ntext'},
        {kindCode: 'reserved', text: 'alter'},
        {kindCode: 'reserved', text: 'begin'},
        {kindCode: 'reserved', text: 'break'},
        {kindCode: 'reserved', text: 'check'},
        {kindCode: 'reserved', text: 'close'},
        {kindCode: 'reserved', text: 'cross'},
        {kindCode: 'reserved', text: 'fetch'},
        {kindCode: 'reserved', text: 'grant'},
        {kindCode: 'reserved', text: 'group'},
        {kindCode: 'reserved', text: 'index'},
        {kindCode: 'reserved', text: 'inner'},
        {kindCode: 'reserved', text: 'merge'},
        {kindCode: 'reserved', text: 'order'},
        {kindCode: 'reserved', text: 'outer'},
        {kindCode: 'reserved', text: 'pivot'},
        {kindCode: 'reserved', text: 'print'},
        {kindCode: 'reserved', text: 'right'},
        {kindCode: 'reserved', text: 'table'},
        {kindCode: 'reserved', text: 'union'},
        {kindCode: 'reserved', text: 'where'},
        {kindCode: 'reserved', text: 'while'},
    ],
    //6
    [
        {kindCode: 'datatype', text: 'bigint'},
        {kindCode: 'datatype', text: 'binary'},
        {kindCode: 'datatype', text: 'cursor'},
        {kindCode: 'reserved', text: 'backup'},
        {kindCode: 'reserved', text: 'browse'},
        {kindCode: 'reserved', text: 'column'},
        {kindCode: 'reserved', text: 'commit'},
        {kindCode: 'reserved', text: 'create'},
        {kindCode: 'reserved', text: 'cursor'},
        {kindCode: 'reserved', text: 'delete'},
        {kindCode: 'reserved', text: 'double'},
        {kindCode: 'reserved', text: 'errlvl'},
        {kindCode: 'reserved', text: 'escape'},
        {kindCode: 'reserved', text: 'except'},
        {kindCode: 'reserved', text: 'exists'},
        {kindCode: 'reserved', text: 'having'},
        {kindCode: 'reserved', text: 'insert'},
        {kindCode: 'reserved', text: 'lineno'},
        {kindCode: 'reserved', text: 'nullif'},
        {kindCode: 'reserved', text: 'option'},
        {kindCode: 'reserved', text: 'public'},
        {kindCode: 'reserved', text: 'return'},
        {kindCode: 'reserved', text: 'revert'},
        {kindCode: 'reserved', text: 'revoke'},
        {kindCode: 'reserved', text: 'schema'},
        {kindCode: 'reserved', text: 'select'},
        {kindCode: 'reserved', text: 'unique'},
        {kindCode: 'reserved', text: 'update'},
        {kindCode: 'reserved', text: 'values'},
        {kindCode: 'reserved', text: 'within'},
    ],
    //7
    [
        {kindCode: 'datatype', text: 'decimal'},
        {kindCode: 'datatype', text: 'numeric'},
        {kindCode: 'datatype', text: 'sysname'},
        {kindCode: 'datatype', text: 'tinyint'},
        {kindCode: 'datatype', text: 'varchar'},
        {kindCode: 'reserved', text: 'between'},
        {kindCode: 'reserved', text: 'cascade'},
        {kindCode: 'reserved', text: 'collate'},
        {kindCode: 'reserved', text: 'compute'},
        {kindCode: 'reserved', text: 'convert'},
        {kindCode: 'reserved', text: 'current'},
        {kindCode: 'reserved', text: 'declare'},
        {kindCode: 'reserved', text: 'default'},
        {kindCode: 'reserved', text: 'execute'},
        {kindCode: 'reserved', text: 'foreign'},
        {kindCode: 'reserved', text: 'nocheck'},
        {kindCode: 'reserved', text: 'offsets'},
        {kindCode: 'reserved', text: 'openxml'},
        {kindCode: 'reserved', text: 'percent'},
        {kindCode: 'reserved', text: 'primary'},
        {kindCode: 'reserved', text: 'restore'},
        {kindCode: 'reserved', text: 'setuser'},
        {kindCode: 'reserved', text: 'trigger'},
        {kindCode: 'reserved', text: 'tsequal'},
        {kindCode: 'reserved', text: 'unpivot'},
        {kindCode: 'reserved', text: 'varying'},
        {kindCode: 'reserved', text: 'waitfor'},
    ],
    //8
    [
        {kindCode: 'datatype', text: 'datetime'},
        {kindCode: 'datatype', text: 'geometry'},
        {kindCode: 'datatype', text: 'nvarchar'},
        {kindCode: 'datatype', text: 'smallint'},
        {kindCode: 'reserved', text: 'coalesce'},
        {kindCode: 'reserved', text: 'contains'},
        {kindCode: 'reserved', text: 'continue'},
        {kindCode: 'reserved', text: 'database'},
        {kindCode: 'reserved', text: 'distinct'},
        {kindCode: 'reserved', text: 'external'},
        {kindCode: 'reserved', text: 'freetext'},
        {kindCode: 'reserved', text: 'function'},
        {kindCode: 'reserved', text: 'holdlock'},
        {kindCode: 'reserved', text: 'identity'},
        {kindCode: 'reserved', text: 'national'},
        {kindCode: 'reserved', text: 'readtext'},
        {kindCode: 'reserved', text: 'restrict'},
        {kindCode: 'reserved', text: 'rollback'},
        {kindCode: 'reserved', text: 'rowcount'},
        {kindCode: 'reserved', text: 'shutdown'},
        {kindCode: 'reserved', text: 'textsize'},
        {kindCode: 'reserved', text: 'truncate'},
    ],
    //9
    [
        {kindCode: 'datatype', text: 'datetime2'},
        {kindCode: 'datatype', text: 'geography'},
        {kindCode: 'datatype', text: 'timestamp'},
        {kindCode: 'datatype', text: 'varbinary'},
        {kindCode: 'reserved', text: 'clustered'},
        {kindCode: 'reserved', text: 'intersect'},
        {kindCode: 'reserved', text: 'openquery'},
        {kindCode: 'reserved', text: 'precision'},
        {kindCode: 'reserved', text: 'procedure'},
        {kindCode: 'reserved', text: 'raiserror'},
        {kindCode: 'reserved', text: 'writetext'},
    ],
    //10
    [
        {kindCode: 'datatype', text: 'rowversion'},
        {kindCode: 'datatype', text: 'smallmoney'},
        {kindCode: 'reserved', text: 'checkpoint'},
        {kindCode: 'reserved', text: 'constraint'},
        {kindCode: 'reserved', text: 'deallocate'},
        {kindCode: 'reserved', text: 'fillfactor'},
        {kindCode: 'reserved', text: 'openrowset'},
        {kindCode: 'reserved', text: 'references'},
        {kindCode: 'reserved', text: 'rowguidcol'},
        {kindCode: 'reserved', text: 'statistics'},
        {kindCode: 'reserved', text: 'updatetext'},
    ],
    //11
    [
        {kindCode: 'datatype', text: 'hierarchyid'},
        {kindCode: 'datatype', text: 'sql_variant'},
        {kindCode: 'reserved', text: 'distributed'},
        {kindCode: 'reserved', text: 'identitycol'},
        {kindCode: 'reserved', text: 'reconfigure'},
        {kindCode: 'reserved', text: 'replication'},
        {kindCode: 'reserved', text: 'system_user'},
        {kindCode: 'reserved', text: 'tablesample'},
        {kindCode: 'reserved', text: 'transaction'},
        {kindCode: 'reserved', text: 'try_convert'},
    ],
    //12
    [
        {kindCode: 'reserved', text: 'current_date'},
        {kindCode: 'reserved', text: 'current_time'},
        {kindCode: 'reserved', text: 'current_user'},
        {kindCode: 'reserved', text: 'nonclustered'},
        {kindCode: 'reserved', text: 'session_user'},
    ],
    //13
    [
        {kindCode: 'datatype', text: 'smalldatetime'},
        {kindCode: 'reserved', text: 'authorization'},
        {kindCode: 'reserved', text: 'containstable'},
        {kindCode: 'reserved', text: 'freetexttable'},
        {kindCode: 'reserved', text: 'securityaudit'},
    ],
    //14
    [
        {kindCode: 'datatype', text: 'datetimeoffset'},
        {kindCode: 'reserved', text: 'opendatasource'},
    ],
    //15
    [
        {kindCode: 'reserved', text: 'identity_insert'},
    ],
    //16
    [
        {kindCode: 'datatype', text: 'uniqueidentifier'},
    ],
    //17
    [
        {kindCode: 'reserved', text: 'current_timestamp'},
    ],
    //18
    [
        
    ],
    //19
    [
        
    ],
    //20
    [
        
    ],
    //21
    [
        
    ],
    //22
    [
        {kindCode: 'reserved', text: 'semantickeyphrasetable'},
    ],
    //23
    [
        {kindCode: 'reserved', text: 'semanticsimilaritytable'},
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
        {kindCode: 'reserved', text: 'semanticsimilaritydetailstable'},
    ],
] as TWorldItem[][]

