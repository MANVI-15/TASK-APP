//database model for users

const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//USER MODEL DESCRIPTION AND ( DATA VALIDATION AND DATA SANITIZATION IMPLEMENTATION) CHECKS


const UserSchema=new mongoose.Schema({
    name:
    {
        type: String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true, 
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    age:
    {
       type:Number,
       default:0,
       validate(value)
       {
           if(value<0)
           {
               throw new Error('Age must be a positive number')
           }
       }
    },
    password:
    {
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
           if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password is invalid');   
            }
        }
    },
    tokens:[{
         token:
         {
             type: String,
             required: true,
         }
    }]
})

//FUNCTION FOR VERIFYING CREDENTIALS OF USERS DURING LOGIN
UserSchema.statics.findByCredentials = async(email,password)=>{

    
    const user=await User.findOne({email});

    if(!user)
    {
        throw new Error("Unable to login");
    }


    const isMatch= await bcrypt.compare(password,user.password);

    if(!isMatch)
    {
        throw new Error("Unable to Login");
    }


    return user;
}


//every time when epress sends the  repose back it stringifies the objet in response and whenver we stringify the object toJSON is called 
//automatically on which it is defined
UserSchema.methods.toJSON=function()
{
    const user=this;
    const obj=user.toObject();


    delete obj.password;
    delete obj.tokens;

    return obj;

}


//STATIC METHODS ARE ACCESSIBLE BY WHOLE MODEL LIKE USER SOMETIME KNOWN aS MODEL METHODS
//METHODS ARE ACCESIBLE BY INSTANCE 



//FUNCTION FOR GENERATING AUTHENTICATION TOKEN FOR USER
UserSchema.methods.findByAuth=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},'thisismysummerproject');
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
}



//middleware are special function provided by moongose to perform special task
//.pre to perform something before some task
//for hashing the plain text password before storing it in database
UserSchema.pre('save',async function(next){
  const user=this;

  //user.isModified() return true if new user is added or if password field of exisitng user is modified it is also provided by moongose
  if(user.isModified('password'))
  {
      user.password=await bcrypt.hash(user.password,8);
  }
  next
})

const User=mongoose.model('User', UserSchema)

module.exports=User;
