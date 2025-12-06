const mongoose = require('mongoose');

const userschema = new Schema({
    name:{Type:String,required:true},
    email:{Type:String,required:true, unique:true},
    password:{Type:String,required:true}
});
export default mongoose.model(userschema);