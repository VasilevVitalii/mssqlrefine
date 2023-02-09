import fs from 'fs'
import path from "path";
import { Parse } from "../src/tokenizator";

//const a = Parse(["select a, b, c","from ddd"])
//console.log(JSON.stringify(a, null, '\t'))

const onlyFiles = [
]

const pathtest = path.join(__dirname, '..', '..', 'test', 'testcases')
fs.readdir(pathtest, (err, files) => {
    if (err) {
        console.error(err)
        return
    }

    files.forEach(file => {
        try {
            if (onlyFiles.length > 0) {
                if (!onlyFiles.includes(file)) return
            }

            const t = JSON.parse(fs.readFileSync(path.join(pathtest, file), 'utf8'))
            const tJsonRes = JSON.stringify(t.result, null, '\t')
            const test = t.test as string[]
            const p = Parse(test)
            const pJsonRes = JSON.stringify(p, null, '\t')

            if (test.length !== p.length) {
                console.error(`error test (length) from file ${file} - in text=${test.length}, in parse=${p.length}`)
                return
            }

            for (let i = 0; i < test.length; i++) {
                const ttt = test[i]
                const ppp = p[i].chunks.map(m => m.text).join('')
                if (ttt !== ppp) {
                    console.error(`error test (text) from file ${file} in line ${i}`)
                    console.error(`need:   ${ttt}`)
                    console.error(`result: ${ppp}`)
                    return
                }
            }

            if (tJsonRes.toLowerCase() !== pJsonRes.toLowerCase()) {
                console.error(`error test (json) from file ${file}`)
                console.log('========NEED==============================')
                console.log(tJsonRes)
                console.log('========RESULT============================')
                console.log(pJsonRes)
                console.log('========END===============================')
                console.log('')
                return
            }

            console.log(`success test from file ${file}`)
        } catch (err) {
            console.error(err)
        }
    })
})

//console.log(__dirname)

// import * as lib from '../src/refiner'
// import * as app from '../src'

// type TRefinerTestList = {
//     text: string[],
//     res: string[],
//     initDeep: number,
//     initDeepType: lib.TEntry | undefined,
//     resDeep: number,
//     resDeepType: lib.TEntry | undefined
// }

// const refinerTestList = [
//     {text: ["'asd' fff"], res: ["##### fff"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["fff 'asd'"], res: ["fff #####"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["fff 'asd' ddd"], res: ["fff ##### ddd"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["/*asd*/ fff"], res: ["####### fff"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["fff /*asd*/"], res: ["fff #######"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["fff /*asd*/ ddd"], res: ["fff ####### ddd"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: ["/*asd*/ aa /*'a'*/"], res: ["####### aa #######"], initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: "/*%--a%*/".split('%'), res: "##%###%##".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {text: "'%/*a*/%'".split('%'), res: "#%#####%#".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined},
//     {
//         text: "DECLARE @a VARCHAR(MAX) = 'DECLARE @b VARCHAR(MAX) = ''a''% + ''b''; PRINT(@b)'".split('%'),
//         res:  "DECLARE @a VARCHAR(MAX) = ################################%####################".split('%'),
//         initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined
//     },
//     {
//         text: [
//             "SET ANSI_NULLS ON",
//             "GO",
//             "SET QUOTED_IDENTIFIER ON",
//             "GO",
//             "-- Create the stored procedure in the specified schema",
//             "ALTER PROCEDURE [dbo].[sp1]",
//             "    @param1 /*parameter name*/ int /*datatype_for_param1*/ = 0, /*default_value_for_param1*/",
//             "    @param2 /*parameter's name*/ int /*datatype_for_param1*/ = 0 /*default_value_for_param2*/",
//             "-- add more stored ' procedure parameters here",
//             "AS",
//             "BEGIN",
//             "    -- body of the stored procedure",
//             "/*/* m */*/",
//             "",
//             "    --/*",
//             "",
//             "    DECLARE @a VARCHAR(MAX) = 'PRINT ''hello'''",
//             "    PRINT 'mssqldev1.master.sys.databases'",
//             "",
//             "    SELECT 'aaaa', /*'bbbb'*/* FROM self.master.sys.databases",
//             "    SELECT * FROM self.TEST.dbo.Table1",
//             "    --*/",
//             "    --SELECT * FROM [mssqldev1].master.sys.databases;  ",
//             "END",
//             "GO"
//         ],
//         res:  [
//             "SET ANSI_NULLS ON",
//             "GO",
//             "SET QUOTED_IDENTIFIER ON",
//             "GO",
//             "######################################################",
//             "ALTER PROCEDURE [dbo].[sp1]",
//             "    @param1 ################## int ####################### = 0, ############################",
//             "    @param2 #################### int ####################### = 0 ############################",
//             "##############################################",
//             "AS",
//             "BEGIN",
//             "    ###############################",
//             "###########",
//             "",
//             "    ####",
//             "",
//             "    DECLARE @a VARCHAR(MAX) = #################",
//             "    PRINT ################################",
//             "",
//             "    SELECT ######, ##########* FROM self.master.sys.databases",
//             "    SELECT * FROM self.TEST.dbo.Table1",
//             "    ####",
//             "    ###################################################",
//             "END",
//             "GO"
//         ],
//         initDeep: 0, initDeepType: undefined, resDeep: 0, resDeepType: undefined
//     },
//     {text: "/*%--a%".split('%'), res: "##%###%".split('%'), initDeep: 0, initDeepType: undefined, resDeep: 1, resDeepType: 'comment-multi'},
//     {text: "aa%b*/b'".split('%'), res: "##%#####".split('%'), initDeep: 1, initDeepType: 'string', resDeep: 0, resDeepType: undefined},
//     {text: "--a%--b".split('%'), res: "###%###".split('%'), initDeep: 1, initDeepType: 'comment-multi', resDeep: 1, resDeepType: 'comment-multi'},
//     {text: "--a%-'a/*-b".split('%'), res: "###%##a####".split('%'), initDeep: 1, initDeepType: 'string', resDeep: 1, resDeepType: 'comment-multi'}
// ] as TRefinerTestList[]

// const onlyOneRefinerTestIdx = 12
// const refinerTestTitle = 'Refiner and SimpleRefine test'

// refinerTestList.forEach((test, idx) => {
//     if (onlyOneRefinerTestIdx >= 0 && onlyOneRefinerTestIdx !== idx) return
//     const res1 = lib.Refine(test.initDeep, test.initDeepType, test.text, '#')
//     const res2 = app.SimpleRefine(test.text)

//     if (test.text.length !== res1.length) {
//         console.error(`${refinerTestTitle} #${idx} - different count arr(test - ${test.text.length}, res1 - ${res1.length})`)
//     } else {
//         for (let i = 0; i < res1.length; i++) {
//             if (test.text[i].length !== res1[i].line.length) {
//                 console.error(`${refinerTestTitle} #${idx} - different len in line ${i} (test - ${test.text[i].length}, res1 - ${res1[i].line.length})`)
//             }
//             if (test.res[i] !== res1[i].line) {
//                 console.error(`${refinerTestTitle} #${idx} - different text in line ${i} (test - "${test.res[i]}", res1 - "${res1[i].line}")`)
//             }
//         }
//     }
//     if (test.resDeep !== res1[res1.length - 1].endDeep) {
//         console.error(`${refinerTestTitle} #${idx} - different deep (test - ${test.resDeep}, res1 - ${res1[res1.length - 1].endDeep})`)
//     }

//     if ((test.resDeepType || res1[res1.length - 1].endDeepType) && test.resDeepType !== res1[res1.length - 1].endDeepType) {
//         console.error(`${refinerTestTitle} #${idx} - different deep type (test - ${test.resDeepType}, res1 - ${res1[res1.length - 1].endDeepType})`)
//     }

//     if (test.initDeep === 0 && !test.initDeepType) {
//         if (test.text.length !== res2.length) {
//             console.error(`${refinerTestTitle} #${idx} - different count arr(test - ${test.text.length}, res2 - ${res2.length})`)
//         } else {
//             for (let i = 0; i < res2.length; i++) {
//                 if (test.text[i].length !== res2[i].length) {
//                     console.error(`${refinerTestTitle} #${idx} - different len in line ${i} (test - ${test.text[i].length}, res2 - ${res2[i].length})`)
//                 }
//                 if (test.res[i].replaceAll('#',' ') !== res2[i]) {
//                     console.error(`${refinerTestTitle} #${idx} - different text in line ${i} (test - "${test.res[i].replace('#',' ')}", res2 - "${res2[i]}")`)
//                 }
//             }
//         }
//     }
// })
// console.log(`${refinerTestTitle} complete`)

// const r = app.CreateRefineService(['select 1','/*','select 2','*/','select 3'])
// r.refine()
// if (r.TextRefined.map(m => {return m.line}).join('') !== `select 1${' '.repeat(12)}select 3`) {
//     console.error('RefineService: error in test #1')
// }

// r.TextRaw.splice(2)
// r.TextRaw.push(...['*/','select 3 /*a*/'])
// r.refineAt(2)
// if (r.TextRefined.map(m => {return m.line}).join('') !== `select 1${' '.repeat(4)}select 3 ${' '.repeat(5)}`) {
//     console.error('RefineService: error in test #2')
// }

// console.log(`RefineService complete`)