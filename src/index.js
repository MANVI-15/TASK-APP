const express=require('express');
require('./db/mongoose');
const userRoute = require('./routers/users.js');
const taskRoute=require('./routers/task.js')


const app=express();
const port=process.env.PORT||3000


//middle ware function that will run between
// app.use((req,res,next)=>{
   
//      res.status(503).send("Under maintenance");

// })

//TO PARSE THE JSON DATA RECEIVED FROM CLIENT SIDE
app.use(express.json());
app.use(userRoute);
app.use(taskRoute)



app.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})

