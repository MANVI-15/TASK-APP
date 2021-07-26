const express=require('express');
const router=new express.Router();
const User=require('../models/User')
const auth=require('../middlewares/auth.js')

/***************************LOGOUT ***************************/

router.post('/users/logout',auth,async(req,res)=>{

    try
    {
         req.user.tokens =req.user.tokens.filter((token)=> token.token !== req.token)
         await req.user.save()
         res.send();
}catch(e)
{
    res.status(500).send();
}

})


router.post('/users/logoutall', auth , async(req,res)=>{

    try{
      
        req.user.tokens=[];
        await req.user.save();
        res.send()

    }catch(e)
    {
        res.status(500).send(e);
    }
})

/*****************************LOGIN **********************/

router.post('/users/login',async(req,res)=>{
   
    try
    {
      
       const user=await User.findByCredentials(req.body.email,req.body.password);
       const token=await user.findByAuth();
       res.send({user,token});

    }catch(e)
    {
        res.status(400).send();
    }

})


/******************************************FOR INSERTING************************************/

router.post('/users',async(req,res)=>{
    const user=new User(req.body);

   try {
         await user.save();
         const token=await user.findByAuth();
         res.status(201).send({user,token});
        
    } catch (e) {

     res.status(400).send(e);   
    }

    /*user.save().then(()=>{
        res.status(201).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })*/
    
})

/*******************************FOR SEARCHING*********************************/


//to fetch all users we cannot use this route because this will  make othe users to see the email id of all other users includeing them
// router.get('/users',auth,async (req,res)=>{

//     try{
//         const users=await User.find({});
//         res.send(users);
//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
   
//    // User.find({}).then((users)=>{
//    //     res.send(users);
//    // }).catch((e)=>{
//    //     res.status(500).send();
//    // })
// })

router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user);
})

//for fetching users with particular id
router.get('/users/:id',async(req,res)=>{
   const id=req.params.id;

   try{
   
       const user=await User.findById(id);
       if(!user)
       {
           return res.status(404).send()
       }
       res.send(user);

   }catch(e)
   {
       res.status(500).send(e);
   }

   // User.findById(id).then((user)=>{
   //     if(!user)
   //     {
   //         return res.status(404).send();
   //     }
   //     res.send(user);
   // }).catch((error)=>{
   //     res.status(500).send();
   // })
})
//////////////////////////////////////**********FOR UPDATING****************////////////////////////////////////////////////////////


router.patch('/users/me',auth,async (req,res)=>{



    //Object.keys() returns an array whose elements are strings corresponding to the enumerable properties found directly upon object .
    const updates=Object.keys(req.body);
    const allowUpdates=['name','email','password','age'];
     
   
    // every() method returns true if all elements in an array pass a test (provided as a function).
    const verified=updates.every((update)=>{
        
        return allowUpdates.includes(update);
    })

   
    //to check hether the field the user is updating is present in schema or not
    if(!verified)
    {
       return res.status(404).send('Invalid updates') ; 
    }
    try{
   
        
        updates.forEach((update)=>{
           req.user[update]=req.body[update]
        })

        await req.user.save();

        //runValidator is set true   because it is used to validate the object we are sending for update
        //new is set true to return the modified object
        //findByIdAndUpdate bypasses mongoose it directly updates in the database to run the middleware we cannot use this
        //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
        
         res.status(200).send(req.user);

    }catch(e)
    {
        res.status(500).send(e);
    }
})

//DONT NEED THIS 
// router.patch('/users/:id',async (req,res)=>{



//     //Object.keys() returns an array whose elements are strings corresponding to the enumerable properties found directly upon object .
//     const updates=Object.keys(req.body);
//     const allowUpdates=['name','email','password','age'];
     
   
//     // every() method returns true if all elements in an array pass a test (provided as a function).
//     const verified=updates.every((update)=>{
        
//         return allowUpdates.includes(update);
//     })

   
//     //to check hether the field the user is updating is present in schema or not
//     if(!verified)
//     {
//        return res.status(404).send('Invalid updates') ; 
//     }
//     try{
   
//         const user=await User.findById(req.params.id);
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })

//         await user.save();

//         //runValidator is set true   because it is used to validate the object we are sending for update
//         //new is set true to return the modified object
//         //findByIdAndUpdate bypasses mongoose it directly updates in the database to run the middleware we cannot use this
//         //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
//         if(!user)
//         {
//             res.status(404).send();
//         } 
//          res.status(200).send(user);

//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
// })

//////////////////////////////////////*********DELETING THE DATA ************************///////////////////////

router.delete('/users/me',auth,async(req,res)=>{
  
    try{
        
        await req.user.remove();
        res.send(req.user);
    }catch(e)
    {
        res.status(500).send(e);
    }
})

//we  no longer need this function becuase we dont want to allow user to delete any other user using their id w must allow them only to delete their
//own profile
// router.delete('/users/:id',async(req,res)=>{
  
//     try{
//         const user=await User.findByIdAndDelete(req.params.id);
//         if(!user)
//         {
//             res.status(404).send();
//         }
//         res.send(user);
//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
// })

module.exports=router;