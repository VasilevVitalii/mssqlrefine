<div id="badges">
  <a href="https://www.linkedin.com/in/vasilev-vitalii/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
  <a href="https://www.youtube.com/@user-gj9vk5ln5c/featured">
    <img src="https://img.shields.io/badge/YouTube-red?style=for-the-badge&logo=youtube&logoColor=white" alt="Youtube Badge"/>
  </a>
</div>

# mssqlrefine
Building tokens based on the mssql query text
## License
*MIT*
## Install
```
npm i mssqlrefine
```
## Example
```javascript
import { CreateRefineService } from 'mssqlrefine'

const refineService = CreateRefineService()
refineService.prepareWorldsAll('upper')

//build tokens in one iteration
const tokens1 = refineService.getTokens([
    `select a, /*comment*/, [b]+[c], 'string' as d`,
    `from mytable order by a --comment`
])

//build tokens in two iterations
const tokens2 = refineService.getTokens([
    `select a, /*comment*/, [b]+[c], 'string' as d`
])
tokens2.push(...refineService.getTokens([`from mytable order by a --comment`], tokens2))

//tokens1 and tokens2 are equal
console.log(tokens1)
console.log(tokens2)
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
				"deepImpartible": 0,
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
				"deepImpartible": 0,
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
				"deepImpartible": 0,
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
				"deepImpartible": 0,
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
				"idx": 24,
				"kind": "comment-single",
				"text": "--comment"
			}
		]
	}
]
```
