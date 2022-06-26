const mongoose = require('mongoose');
//Set up default mongoose connection

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true,useUnifiedTopology:true })
.then(()=>console.log("database connected"))
 .catch (error=> console.log(error))