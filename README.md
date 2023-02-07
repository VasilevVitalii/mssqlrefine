# mssqlrefine
Сlearing mssql text from comments and string variables
## License
*MIT*
## Install
```
npm i mssqltask
```
## Example
```javascript
import * as mssqlrefine from 'mssqlrefine'

//example 1 - use SimpleRefine for refine all script

console.log(mssqlrefine.SimpleRefine([
    "select 1, 'aaaa', 2",
    "/*comment*/ select 3",
    "select 3 --comment"
]))


//example 2 - use CreateRefineService for refine part on the script

const r = mssqlrefine.CreateRefineService([
    "select 1",
    "/*",
    "select 2",
    "*/",
    "select 3"
])
r.refine()
console.log(r.TextRefined.map(m => { return m.line }))

r.TextRaw.splice(2)
r.TextRaw.push(...["select 21", "*/", "select 3"])
r.refineAt(2)
console.log(r.TextRefined.map(m => { return m.line }))
```
