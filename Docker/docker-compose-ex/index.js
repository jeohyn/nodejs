const express=require("express");
const redis=require("redis"); //NoSql database

//create redis client
const client=redis.createClient({
    //if it's not in docker env, https://redis서버가 작동하는 곳
    //if it's in docker env, give container name that we define in docker-compose.yml
    //in this ex, container name in docker-compose.yml : redis-server
    host:"redis-server", 
    prot:6379 //default redis port
});


const app=express();

//number starts from 0
client.set("number", 0);

app.get('/', (req, res)=>{
    client("number", (err, number)=>{
        //get the current number and increase 1
        client.set("number", parseInt(number)+1);
        res.send("접속 할 때마다 숫자가 1씩 증가. 숫자 : "+number);
    })
})

app.listen(8080);
console.log('Server is running');