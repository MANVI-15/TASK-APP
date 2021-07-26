//DATABASE MODEL FOR TASK DATABASE

const mongoose=require('mongoose');

//TASK MODEL DESCRIPTION AND ( DATA VALIDATION ANND DATA SANITIZATION IMLEMENTATION) CHECKS

const Task=mongoose.model('Task',{
  
  
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:
    {
        type:Boolean,
        default:false
    }
})


module.exports=Task;