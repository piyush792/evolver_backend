exports.index= function(req,res){
    //users.getdata();
    res.render('dashboard', {'title':'Dashbaord','datatitle':'piyush'} );
    console.log("sadasdsad"); 
    console.log(req.session.username); //return true;
    //alert(req.session.email);
   if(!req.session.username || req.session.username==undefined ){
        res.redirect('auth'); 
   }else{
        res.render('dashboard', {'datatitle':req.session.username });
   }
}
