const express=require('express');
const router=new express.Router();
const Task=require('../models/Task')


/***********************FOR INSERTING******************* */


router.post('/tasks',async (req,res)=>{
    const task=new Task(req.body);
 
    try{
        
        await task.save();
        res.status(200).send(task);
    }catch(e){
      
       res.status(400).send(e);
    }
    
 //    Task.save().then((task)=>{
 //        res.status(201).send(task);
 //    }).catch((e)=>{
 //        res.status(400).send(e);
 //    })
 })
 
 /*******************************FOR SEARCHING*********************************/
 
 
 
 //to fetch all tasks
 
 router.get('/tasks',async (req,res)=>{
     
     try{
          const tasks=await Task.find({});
          res.send(tasks);
 
     }catch(e)
     {
         res.status(500).send(e);
     }
     // Task.find({}).then((tasks)=>{
     //    res.send(tasks);
 
     // }).catch((e)=>{
         
     //     res.send(500).status();
     // })
 })
 
 //to fetch tasks by id
 
 router.get('/tasks/:id',async (req,res)=>{
     const id=req.params.id;
 
     try{
     
         const task=await Task.findById(id);
         if(!task)
         {
             return res.status(404).send()
         }
         res.send(task);
 
     }catch(e)
     {
         res.status(500).send(e);
     }
 
     // Task.findById(id).then((task)=>{
     //     if(!task)
     //     {
     //         return res.status(404).send();
     //     }
     //     res.send(task);
     // }).catch((error)=>{
     //     res.status(500).send();
     // })
 })
 
 
 //////////////////////////////////////**********FOR UPDATING****************////////////////////////////////////////////////////////
 
 
 
 
 router.patch('/tasks/:id',async (req,res)=>{
     
     const updates=Object.keys(req.body);
     const allowupdates=['description','completed'];
     const verified=updates.every((update)=>{
         return allowupdates.includes(update);
     })
 
     if(!verified)
     {
         return res.status(404).send("Invalid updates");
     }
 
     try
     {
         const task=await Task.findById(req.params.id);
         updates.forEach((update)=>{
             task[update]=req.body[update];
         })

         await task.save();
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
     
     if(!task)
     {
         res.status(404).send();
     }
     res.send(task);
     }catch(e)
     {
         res.status(500).send(e);
     }
 
 })
 
 
 //////////////////////////////////////*********DELETING THE DATA ************************///////////////////////
 
 
 router.delete('/tasks/:id',async(req,res)=>{
     try{
         const task=await Task.findByIdAndDelete(req.params.id);
         if(!task)
         {
             res.status(404).send();
         }
         res.send(task);
     }catch(e)
     {
         res.status(500).send(e);
     }
 })
 
module.exports=router;