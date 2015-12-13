API
---

```
GET     http://penny-split.rhcloud.com/get/categories
GET     http://penny-split.rhcloud.com/get/toCategories
POST    http://penny-split.rhcloud.com/get/balances
POST    http://penny-split.rhcloud.com/get/expenses
POST    http://penny-split.rhcloud.com/get/transactions
```
```
POST http://penny-split.rhcloud.com/set/transaction
POST http://penny-split.rhcloud.com/set/updateTxns
```


eg:

Use HTTPRequester in `firefox` 
or postman in `chrome` to test

POST 

    {"query":{"date":{}}}

to

    http://penny-split.rhcloud.com/get/balances 

will fetch json response

{"credit | bank":-18380.28999999998,"CITI | bank":45403,"iitbCanara
| bank":35026,"income | bank":-550857,"cash | bank":4444,"SBI
| bank":900,"lent | bank":-10,"SBI Fixed | bank":12799,"sodexo | bank":0,"citi
fixed | bank":14400}

