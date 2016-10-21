var USER = require('../schema/user');
var PET = require('../schema/pet');

exports.addusr=function(req,res){

    var usr = new USER({
        username:req.body.name,
        email:req.body.email,
        password:req.body.password
    });

    usr.save(function(err,d){
        if(err) res.send({success:false , d:err});
        else res.send({success:true , d:d});  
    })
	
}

exports.login=function(req,res){
    USER.findOne({$or:[{username:req.body.username,password:req.body.password},{email:req.body.username,password:req.body.password}]} ,
    function(err,usr){
        if(err) res.send({success:false , d:err});
        else if(!usr) res.send({success:false , d:usr});
        else setSesstion(req,res,usr);
    });
}

function setSesstion(req,res ,data){
     req.session.sessUser ={
        ID: data._id,
        userAuthenticate: true,
        name: data.username
      }
      res.send({success:true , d:data});
}

exports.authenticate=function(req,res,next){    
    if(req.session.sessUser) return next();
    else res.redirect('/');
}

exports.logout=function(req,res){
    req.session.destroy(function(err) {  console.log(err); });
    res.redirect('/');
}

exports.addDefaultPet=function(req,res,next){
    PET.find(function(err,pet){        
        if(!pet || pet.length==0)  addPet(req,res,next);
        else next();
    });
}

function addPet(req,res,next){
    PET.create({name:'Cat',cost:40},{name:'Bird',cost:100},{name:'Fish',cost:90},{name:'Dog',cost:50},function(err,c,b,f,d){
        // res.send({e:err,c:c,b:b,f:f,d:d});
        if(!err) next();
    })
}

exports.petList=function(req,res){
    PET.find(function(err,pet){
        if (err) res.send({success:false , pet:pet});
        else res.send({success:true , pet:pet});
    });
}

exports.users=function(req,res){
    USER.findById(req.session.sessUser.ID)
        .populate('petID')
        .exec(function(err,usr){
        if (err) res.send({success:false , usr:usr});
        else res.send({success:true , usr:usr});
    });
}

exports.buy=function(req,res){
    USER.findByIdAndUpdate(req.session.sessUser.ID, {
        $set: {
            pet:req.body
        }
    }, function(err, usr) {
        res.send({
            err: err,
            usr: usr
        });
    });
}
