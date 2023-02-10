import fs from 'fs'
import path from "path";
import { Parse } from "../src/tokenizator";
import * as mssqldriver from 'mssqldriver'

//const a = Parse(["select a, b, c","from ddd"])
//console.log(JSON.stringify(a, null, '\t'))

const onlyFiles = [
]
const pathtest = path.join(__dirname, '..', '..', 'test')
const pathtestcases = path.join(pathtest, 'testcases')

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
mssql.exec([`print 'Hello'`, `select * from sys.columns`], undefined, callbackExec => {
    if (callbackExec.kind === 'finish') {
        if (callbackExec.finish.error) {
            console.error(callbackExec.finish.error.message)
            return
        }
        console.log(`finish`, callbackExec.finish)
    }
})