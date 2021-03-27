const express=require('express');

const PORT=5000;

//app
const app=express();
app.get('/',(req, res)=>{
    res.send("Hello World")
});

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);