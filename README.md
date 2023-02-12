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
import { CreateRefineService } as mssqlrefine from 'mssqlrefine'

const refineService = CreateRefineService()
refineService.prepareWorldsAll('upper')
const tokens = refineService.getTokens([
    `select a, /*comment*/, [b]+[c], 'string' as d`,
    `from mytable order by a --comment`
])
console.log(tokens)
```
```json
[
	{
		"chunks": [
			{
				"idx": 0,
				"kind": "code",
				"kindCode": [
					"statement",
					"query",
					"reserved"
				],
				"text": "SELECT"
			},
			{
				"idx": 6,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 7,
				"kind": "code",
				"text": "a"
			},
			{
				"idx": 8,
				"kind": "comma",
				"text": ","
			},
			{
				"idx": 9,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 10,
				"kind": "comment-multi",
				"text": "/*comment*/"
			},
			{
				"idx": 21,
				"kind": "comma",
				"text": ","
			},
			{
				"idx": 22,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 23,
				"kind": "code-in-bracket",
				"text": "[b]"
			},
			{
				"idx": 26,
				"kind": "operator",
				"text": "+"
			},
			{
				"idx": 27,
				"kind": "code-in-bracket",
				"text": "[c]"
			},
			{
				"idx": 30,
				"kind": "comma",
				"text": ","
			},
			{
				"idx": 31,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 32,
				"kind": "string",
				"text": "'string'"
			},
			{
				"idx": 40,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 41,
				"kind": "code",
				"kindCode": [
					"statement",
					"reserved"
				],
				"text": "AS"
			},
			{
				"idx": 43,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 44,
				"kind": "code",
				"text": "d"
			}
		]
	},
	{
		"chunks": [
			{
				"idx": 0,
				"kind": "code",
				"kindCode": [
					"query",
					"reserved"
				],
				"text": "FROM"
			},
			{
				"idx": 4,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 5,
				"kind": "code",
				"text": "mytable"
			},
			{
				"idx": 12,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 13,
				"kind": "code",
				"kindCode": [
					"query",
					"reserved"
				],
				"text": "ORDER"
			},
			{
				"idx": 18,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 19,
				"kind": "code",
				"kindCode": [
					"query",
					"reserved"
				],
				"text": "BY"
			},
			{
				"idx": 21,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 22,
				"kind": "code",
				"text": "a"
			},
			{
				"idx": 23,
				"kind": "boundary",
				"text": " "
			},
			{
				"idx": 25,
				"kind": "comment-single",
				"text": "--comment"
			}
		]
	}
]
```
