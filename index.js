
const express = require('express')
const app = express()
const port = 3000
const { predict } = require('./predict');

app.get('/cvc', async (req, res) => {
    try {
        console.log(req.query);
        const result = await predict(req.query.t1, req.query.t2); 
        res.send(result)        
    } catch (error) {
        console.log(error.message);
    }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})