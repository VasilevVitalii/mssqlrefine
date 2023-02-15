import os from 'os'
import fs from 'fs'
import path from "path";
import { CreateRefineService } from "../src";
import * as mssqldriver from 'mssqldriver'
import { world } from '../src/world'

const onlyFiles = []
const pathtest = path.join(__dirname, '..', '..', 'test')
const pathtestcases = path.join(pathtest, 'testcases')

const refineService = CreateRefineService()
refineService.prepareWorldsAll()

let hasWordError = false

world.forEach((w,i) => {
    w.forEach((p, ii) => {
        if (p.text.length !== i) {
            console.error(`in world list in array ${i} present world "${p.text}" with len ${p.text.length}`)
            hasWordError = true
        }
        if (p.text.toLowerCase() !== p.text) {
            console.error(`in world list in array ${i} present world "${p.text}" has bad case`)
            hasWordError = true
        }
        for (let jj = ii + 1; jj < w.length; jj++) {
            if (w[jj].text === p.text && w[jj].kindCode === p.kindCode) {
                console.error(`in world list in array ${i} world "${p.text}" non unique`)
                hasWordError = true
            }
        }
    })

})
if (hasWordError) {
    console.log('word has error(s)')
} else {
    console.log('word ok')
}

fs.readdir(pathtestcases, (err, files) => {
    if (err) {
        console.error(err)
        return
    }

    files.forEach(file => {
        try {
            if (onlyFiles.length > 0) {
                if (!onlyFiles.includes(file)) return
            }

            const t = JSON.parse(fs.readFileSync(path.join(pathtestcases, file), 'utf8'))
            const tJsonRes = JSON.stringify(t.result, null, '\t')
            const test = t.test as string[]
            const p = refineService.getTokens(test)
            const pJsonRes = JSON.stringify(p, null, '\t')

            if (test.length !== p.length) {
                console.error(`StartAt OFF: error test (length) from file ${file} - in text=${test.length}, in parse=${p.length}`)
                return
            }

            for (let i = 0; i < test.length; i++) {
                const ttt = test[i]
                const ppp = p[i].chunks.map(m => m.text).join('')
                if (ttt !== ppp) {
                    console.error(`StartAt OFF: error test (text) from file ${file} in line ${i}`)
                    console.error(`need:   ${ttt}`)
                    console.error(`result: ${ppp}`)
                    return
                }
            }

            if (tJsonRes.toLowerCase() !== pJsonRes.toLowerCase()) {
                console.error(`StartAt OFF: error test (json) from file ${file}`)
                console.log('========NEED==============================')
                console.log(tJsonRes)
                console.log('========RESULT============================')
                console.log(pJsonRes)
                console.log('========END===============================')
                console.log('')
                return
            }

            if (p.length <= 1) {
                console.log(`success test from file ${file}`)
                return
            }

            const p1 = [p[0], ...refineService.getTokens(test.slice(1), p.slice(0,1))]
            const p1JsonRes = JSON.stringify(p1, null, '\t')

            if (test.length !== p1.length) {
                console.error(`StartAt ON: error test (length) from file ${file} - in text=${test.length}, in parse=${p1.length}`)
                return
            }

            for (let i = 0; i < test.length; i++) {
                const ttt = test[i]
                const ppp = p1[i].chunks.map(m => m.text).join('')
                if (ttt !== ppp) {
                    console.error(`StartAt ON: error test (text) from file ${file} in line ${i}`)
                    console.error(`need:   ${ttt}`)
                    console.error(`result: ${ppp}`)
                    return
                }
            }

            if (tJsonRes.toLowerCase() !== p1JsonRes.toLowerCase()) {
                console.error(`StartAt ON: error test (json) from file ${file}`)
                console.log('========NEED==============================')
                console.log(tJsonRes)
                console.log('========RESULT============================')
                console.log(p1JsonRes)
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

const connection = {
    server: 'server',
    login: 'login',
    password: 'password',
    database: 'database'
}

if (fs.existsSync(path.join(pathtest, 'connection.json'))) {
    const connectionJson = JSON.parse(fs.readFileSync(path.join(pathtest, 'connection.json'), 'utf8')) as any
    connection.server = connectionJson.server || 'server'
    connection.login = connectionJson.login || 'login'
    connection.password = connectionJson.password || 'password'
    connection.database = connectionJson.database || 'database'
    if (JSON.stringify(connectionJson) !== JSON.stringify(connection)) {
        fs.writeFileSync(path.join(pathtest, 'connection.json'), JSON.stringify(connection, null, '\t'), 'utf8')
    }
} else {
    fs.writeFileSync(path.join(pathtest, 'connection.json'), JSON.stringify(connection, null, '\t'), 'utf8')
}

const mssql = mssqldriver.Create({
    authentication: 'sqlserver',
    instance: connection.server,
    login: connection.login,
    password: connection.password,
    additional: {
        database: connection.database
    }
})
mssql.exec([
    `SELECT [schema], [name], [type], REPLACE(REPLACE([text],'#x0D;',''),'&#x0D;','') [text] FROM (`,
    `    SELECT`,
    `        s.[name] [schema],`,
    `        o.[name] [name],`,
    `        o.[type],`,
    `        STUFF((`,
    `            SELECT CHAR(13) + CHAR(10) + c.[text]`,
    `            FROM syscomments c`,
    `            WHERE c.id = o.object_id`,
    `            ORDER BY c.number`,
    `            FOR XML PATH('')), 1, 1, '') [text]`,
    `    FROM sys.objects o`,
    `    INNER JOIN sys.schemas s ON s.schema_id = o.schema_id`,
    `    WHERE o.[type] IN ('P','FN','IF','TF') `,
    `    GROUP BY s.[name], o.[name], o.[type], o.object_id`,
    `) q`,
    `ORDER BY [schema], [name], [type], [text]`,
].join(os.EOL) , undefined, callbackExec => {
    if (callbackExec.kind === 'finish') {
        if (callbackExec.finish.error) {
            console.error(callbackExec.finish.error.message)
            return
        }
        const rows = callbackExec.finish.tables[0].rows
        rows.forEach(row=>{
            const t = row.text.replaceAll('&\n','\n').split('\n')
            const p = refineService.getTokens(t)
            if (t.length !== p.length) {
                console.error(`error test (length) from sql [${row.type.trim()}] ${row.schema}.${row.name} - in server=${t.length}, in parse=${p.length}`)
                return
            }

            for (let i = 0; i < t.length; i++) {
                const ttt = t[i]
                const ppp = p[i].chunks.map(m => m.text).join('')
                if (ttt !== ppp) {
                    console.error(`error test (text) from sql [${row.type.trim()}] ${row.schema}.${row.name} in line ${i}`)
                    console.error(`need:   ${ttt}`)
                    console.error(`result: ${ppp}`)
                    return
                }
            }

            console.log(`success test from sql [${row.type.trim()}] ${row.schema}.${row.name}`)
        })
    }
})