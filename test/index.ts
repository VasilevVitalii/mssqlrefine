import * as app from '../src/refiner'

type TTestScript = {
    text: string[],
    res: string[],
    initDeep: number,
    initDeepType: app.TEntry | undefined,
    resDeep: number,
    resDeepType: app.TEntry | undefined
}

const testScripts = [
    {text: ["'asd' fff"], res: ["##### fff"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["fff 'asd'"], res: ["fff #####"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["fff 'asd' ddd"], res: ["fff ##### ddd"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["/*asd*/ fff"], res: ["####### fff"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["fff /*asd*/"], res: ["fff #######"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["fff /*asd*/ ddd"], res: ["fff ####### ddd"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: ["/*asd*/ aa /*'a'*/"], res: ["####### aa #######"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: "/*%--a%*/".split('%'), res: "##%###%##".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {text: "'%/*a*/%'".split('%'), res: "#%#####%#".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
    {
        text: "DECLARE @a VARCHAR(MAX) = 'DECLARE @b VARCHAR(MAX) = ''a''% + ''b''; PRINT(@b)'".split('%'),
        res:  "DECLARE @a VARCHAR(MAX) = ################################%####################".split('%'),
        initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined
    },
    {
        text: [
            "SET ANSI_NULLS ON",
            "GO",
            "SET QUOTED_IDENTIFIER ON",
            "GO",
            "-- Create the stored procedure in the specified schema",
            "ALTER PROCEDURE [dbo].[sp1]",
            "    @param1 /*parameter name*/ int /*datatype_for_param1*/ = 0, /*default_value_for_param1*/",
            "    @param2 /*parameter's name*/ int /*datatype_for_param1*/ = 0 /*default_value_for_param2*/",
            "-- add more stored ' procedure parameters here",
            "AS",
            "BEGIN",
            "    -- body of the stored procedure",
            "/*/* m */*/",
            "",
            "    --/*",
            "",
            "    DECLARE @a VARCHAR(MAX) = 'PRINT ''hello'''",
            "    PRINT 'mssqldev1.master.sys.databases'",
            "",
            "    SELECT 'aaaa', /*'bbbb'*/* FROM self.master.sys.databases",
            "    SELECT * FROM self.TEST.dbo.Table1",
            "    --*/",
            "    --SELECT * FROM [mssqldev1].master.sys.databases;  ",
            "END",
            "GO"
        ],
        res:  [
            "SET ANSI_NULLS ON",
            "GO",
            "SET QUOTED_IDENTIFIER ON",
            "GO",
            "######################################################",
            "ALTER PROCEDURE [dbo].[sp1]",
            "    @param1 ################## int ####################### = 0, ############################",
            "    @param2 #################### int ####################### = 0 ############################",
            "##############################################",
            "AS",
            "BEGIN",
            "    ###############################",
            "###########",
            "",
            "    ####",
            "",
            "    DECLARE @a VARCHAR(MAX) = #################",
            "    PRINT ################################",
            "",
            "    SELECT ######, ##########* FROM self.master.sys.databases",
            "    SELECT * FROM self.TEST.dbo.Table1",
            "    ####",
            "    ###################################################",
            "END",
            "GO"
        ],
        initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined
    },
    {text: "/*%--a%".split('%'), res: "##%###%".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 1, resDeepType: 'comment-multi'},
    {text: "aa%b*/b'".split('%'), res: "##%#####".split('%'), initDeep: 1, initDeepType: 'string', resDeep: 0, resDeepType: undefined},
    {text: "--a%--b".split('%'), res: "###%###".split('%'), initDeep: 1, initDeepType: 'comment-multi', resDeep: 1, resDeepType: 'comment-multi'},
    {text: "--a%-'a/*-b".split('%'), res: "###%##a####".split('%'), initDeep: 1, initDeepType: 'string', resDeep: 1, resDeepType: 'comment-multi'}
] as TTestScript[]

const onlyOneTest = -1
let hasError = false

testScripts.forEach((test, idx) => {
    hasError = false
    if (onlyOneTest >= 0 && onlyOneTest !== idx) return
    const res = app.Refine(test.initDeep, test.initDeepType, test.text, '#')
    if (test.text.length !== res.length) {
        hasError = true
        console.error(`test #${idx} - different count arr(test - ${test.text.length}, res - ${res.length})`)
    } else {
        for (let i = 0; i < res.length; i++) {
            if (test.text[i].length !== res[i].line.length) {
                hasError = true
                console.error(`test #${idx} - different len in line ${i} (test - ${test.text[i].length}, res - ${res[i].line.length})`)
            }
            if (test.res[i] !== res[i].line) {
                hasError = true
                console.error(`test #${idx} - different text in line ${i} (test - "${test.res[i]}", res - "${res[i].line}")`)
            }
        }
    }
    if (test.resDeep !== res[res.length - 1].endDeep) {
        hasError = true
        console.error(`test #${idx} - different deep (test - ${test.resDeep}, res - ${res[res.length - 1].endDeep})`)
    }

    if ((test.resDeepType || res[res.length - 1].endDeepType) && test.resDeepType !== res[res.length - 1].endDeepType) {
        hasError = true
        console.error(`test #${idx} - different deep type (test - ${test.resDeepType}, res - ${res[res.length - 1].endDeepType})`)
    }
    if (hasError) {
        console.warn(`test #${idx} has error`)
    } else {
        console.log(`test #${idx} success`)
    }
})