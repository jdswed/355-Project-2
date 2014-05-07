// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');
    ejs        = require('ejs')
    routes     = require('./controller/index'),
    connect    = require('connect'),
    user       = require('./controller/Team');

// Application initialization

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'jswedroe',
        password : '3372088'
    });
    
//var app = module.exports = express.createServer();
var app = express();
app.set('subtitle', 'Project 2');
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

// Database setup
//connection.query('DROP DATABASE IF EXISTS test', function(err) {
//	if (err) throw err;
	connection.query('CREATE DATABASE IF NOT EXISTS jswedroe', function (err) {
	    if (err) throw err;
	    connection.query('USE jswedroe', function (err) {
	        if (err) throw err;
        	connection.query('CREATE TABLE IF NOT EXISTS Batters('
	            + 'id INT NOT NULL AUTO_INCREMENT,'
	            + 'PRIMARY KEY(id),'
        	    + 'CourseNum int(30),'
		    + 'CourseName VARCHAR(30)'                 
	            +  ')', function (err) {
        	        if (err) throw err;
	            });
	    });
	});
//});

// Configuration


app.use(connect.urlencoded());
app.use(connect.json());


// Main route to get to all my pages
app.get('/', function(req, res) {
    res.render('Home');
});

app.get('/Home', function(req, res) {
    res.render('Home');
});

app.get('/Teams', function(req, res) {
    res.render('TeamForm');
});

app.get('/Batters', function(req, res) {
    res.render('BList');
});

app.get('/Pitchers', function(req, res) {
    res.render('Pitchers');
});

app.get('/Managers', function(req, res) {
    res.render('Managers');
});
app.get('/Views', function(req, res) {
    res.render('Views');
});
app.get('/About', function(req, res) {
    res.render('About');
});


app.use(express.static(__dirname  + '/public'));

// Update MySQL database



app.post('/Teams/Select', function (req, res) {
    console.log(req.body);
    connection.query('select Name from Team', 
		     function (err, result) {
			 console.log(result);
			 var responseHTML = '<select id="Team-list">';
			 for (var i=0; result.length > i; i++) {
			     var option = '<option value="' + result[i].Name + '">'  + result[i].Name + '</option>';
			     console.log(option);
			     responseHTML += option;
			 }
			 responseHTML += '</select>';
			 res.send(responseHTML);
		     });
});
app.post('/Teams', function (req, res) {

    console.log(req.body);
    if(typeof req.body.id != 'undefined') {
	
	var query ="select * from Team where Name  = '"+req.body.id+"'";
	
	connection.query(query,
			 function (err, result) {
			     console.log(err);
			     console.log(result);
			     if(result.length > 0) {
				 
				 var  responseHTML =' <table class="users"><tr><th>Name</th><th>League</th><th>Division</th><th>World Series Wins</th><th>City</th><th>State</th><th>Stadium</th><th>Payroll</th><th>Winning Percentage</th></tr>';
				 
				 
				 responseHTML += '<tr><td>' + result[0].Name + '</td>' +
				     '<td>' + result[0].League + '</td>' +
				     '<td>' + result[0].Division + '</td>' +
				     '<td>' + result[0].Num_Championships + '</td>' +
				     '<td>' + result[0].City + '</td>' +
				     '<td>' + result[0].State + '</td>' +
				     '<td>' + result[0].Stadium + '</td>' +
				     '<td>' + result[0].Payroll + '</td>' +
				     '<td>' + result[0].Win_Percent + '</td>' +
				     '</tr></table>';
				 
				 res.send(responseHTML);
                }
			     else
				 res.send('Team does not exist.');
            }
			);
    }
    
    
    else {
        res.send('No data for Team');
    }
});


app.post('/Batters', function (req, res) {
    console.log(req.body);
    connection.query('select * from Batters where Team = ?', req.body.Team, 
		     function (err, result) {
			 console.log(result);
			 if(result.length > 0) {
var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Position</th><th>Service Time</th><th>Games</th><th>PA</th><th>AB</th><th>Runs</th><th>Hits</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>SO</th><th>BA</th><th>OBP</th><th>SLG</th><th>OPS</th><th>Awards</th></tr>';
			     for (var i=0; result.length > i; i++) {


			     responseHTML+= '<td>'+ result[i].Batter_Name + '</td>' +
				 '<td>' + result[i].Team + '</td>' +
				 '<td>' + result[i].Position + '</td>' +
				 '<td>' + result[i].Service_Time + '</td>' +
				 '<td>' + result[i].Games + '</td>' +
				 '<td>' + result[i].PA + '</td>' +
				 '<td>' + result[i].AB + '</td>' +
				 '<td>' + result[i].Runs + '</td>' +
				 '<td>' + result[i].Hits + '</td>' +
				 '<td>' + result[i].Doubles + '</td>' +
				 '<td>' + result[i].Triples + '</td>' +
				 '<td>' + result[i].HR + '</td>' +
				 '<td>' + result[i].RBI + '</td>' +
				 '<td>' + result[i].SB + '</td>' +
				 '<td>' + result[i].CS + '</td>' +
				 '<td>' + result[i].SO + '</td>' +
				 '<td>' + result[i].Batting_Average + '</td>' +
				 '<td>' + result[i].OBP + '</td>' +
				 '<td>' + result[i].SLG + '</td>' +
				 '<td>' + result[i].OPS + '</td>' +
				 '<td>' + result[i].Awards + '</td>'+ 
				 '</tr>';
			     
			     }
			     responseHTML+= '</table>';
			     res.send(responseHTML);
			 }
			 
		     
			 
			 else
			     res.send('Team does not exist Silly.');
		     });
    
});

//Enter a Batter into the Database
app.post('/Batters/Enter', function (req, res) {
    
    
    connection.query('INSERT INTO Batters SET ?', req.body, 
		     function (err, result) {
			 if (err) throw err;
			 connection.query('select * from Batters where Batter_Name = ?', req.body.Batter_Name, 			 
					  function (err, result) {					  
					  if(result.length > 0) {
					 
					      res.send('You Inserted Slugger: ' + result[0].Batter_Name);
					  }
					  else
                                              res.send('Batter was not inserted.');
					 });
                    }
                    );
	 
});


//Display a Single Pitcher's Stats
app.post('/Pitchers', function (req, res) {
    console.log(req.body);
            connection.query('select * from Pitchers where Name = ?', req.body.Name, 
			     function (err, result) {
				 console.log(result);
				 if(result.length > 0) {
				     //create a table
				     var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Type</th><th>Service Time</th><th>Wins</th><th>Losses</th><th>Percent</th><th>ERAs</th><th>G</th><th>GS</th><th>GF</th><th>CG</th><th>SHO</th><th>Saves</th><th>Innings</th><th>H</th><th>Runs</th><th>Earned Runs</th><th>HR</th><th>BB</th><th>IBB</th><th>SO</th><th>Awards</th></tr>';

			             responseHTML+= '<tr><td>' +result[0].Name + '</td >' +
					 '<td>' + result[0].Team + '</td >' +
					 '<td>' + result[0].Type + '</td >' +
					 '<td>' + result[0].Service_Time + '</td >' +
					 '<td>' + result[0].Wins + '</td >' +
					 '<td>' + result[0].Losses + '</td >' +
					 '<td>' + result[0].Win_Percent + '</td >'+
					 '<td>' + result[0].ERA + '</td >' +
					 '<td>' + result[0].Games + '</td >' +
					 '<td>' + result[0].Games_Started + '</td >' +
					 '<td>' + result[0].Games_Finished + '</td >' +
					 '<td>' + result[0].Complete_Games +  '</td >'+
					 '<td>' + result[0].Shutouts + '</td>' +
					 '<td>' + result[0].Saves + '</td >' +
					 '<td>' + result[0].Innings_Pitched + '</td >' +
					 '<td>' + result[0].Hits + '</td>' +
					 '<td>' + result[0].Runs + '</td >' +
					 '<td>' + result[0].Earned_Runs + '</td >' +
					 '<td>' + result[0].HR + '</td>' +
					 '<td>' + result[0].Walks + '</td>' +
					 '<td>' + result[0].IBB + '</td>' +
					 '<td>' + result[0].SO + '</td>' +
					 '<td>' + result[0].Awards + '</tr > </table>';
				     res.send(responseHTML);    
				 }
                    else
			res.send('Pitcher does not exist.');
			     });
    
});

//Enter a Pitcher into the Database                                                                                                                                                                                                                                            
app.post('/Pitchers/Enter', function (req, res) {


    connection.query('INSERT INTO Pitchers SET ?', req.body,
                     function (err, result) {
                         if (err) throw err;
                         connection.query('select * from Pitchers where Name= ?', req.body.Name,
                                          function (err, result) {
                                          if(result.length > 0) {

                                              res.send('You Inserted Hurler: ' + result[0].Name);
                                          }
                                          else
                                              res.send('Pitcher was not inserted.');
                                         });
                    }
                    );

});
app.post('/Managers', function (req, res) {

    console.log(req.body);
            connection.query('select * from Managers where Current_Team = ?', req.body.Name,
                             function (err, result) {
                                 console.log(result);
                                 if(result.length > 0) {
                                     //create a table                                                                                                 
                                     var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Wins</th><th>Losses</th><th>Previously Managed</th></tr>';
				     
	                             responseHTML+= '<tr><td>' +result[0].Name + '</td >' +
                                         '<td>' + result[0].Current_Team + '</td >' +
                                         '<td>' + result[0].Wins + '</td >' +
                                         '<td>' + result[0].Losses + '</td >' +
                                         '<td>' + result[0].Previous_Teams + '</tr > </table>';
                                     res.send(responseHTML);
				 }
				 else
				     res.send('Team does not exist.');
                             });
    
});

app.post('/Views/Batters', function (req, res) {
    console.log(req.body);
    connection.query('select * from Arbitration_Batters ORDER BY Service_Time DESC', req.body.Name, 
		          function (err, result) {
			       console.log(result);
			       if(result.length > 0) {
var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Position</th><th>Service Time</th><th>Games</th><th>PA</th><th>AB</th><th>Runs</th><th>Hits</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>SO</th><th>BA</th><th>OBP</th><th>SLG</th><th>OPS</th><th>Awards</th></tr>';
				        for (var i=0; result.length > i; i++) {
					         //var id = result[i].Name;
					        /* var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Position</th><th>Service Time</th><th>Games</th><th>PA</th><th>AB</th><th>Runs</th><th>Hits</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>SO</th><th>BA</th><th>OBP</th><th>SLG</th><th>OPS</th><th>Awards</th></tr>';*/
					         responseHTML+= '<td>'+ result[i].Batter_Name + '</td>' +
						 '<td>' +'<a href="http://www.'+ result[i].Team +'.com/">'+ result[i].Team+' </a></td>' +
						 '<td>' + result[i].Position + '</td>' +
						 '<td>' + result[i].Service_Time + '</td>' +
						 '<td>' + result[i].Games + '</td>' +
						 '<td>' + result[i].PA + '</td>' +
						 '<td>' + result[i].AB + '</td>' +
						 '<td>' + result[i].Runs + '</td>' +
						 '<td>' + result[i].Hits + '</td>' +
						 '<td>' + result[i].Doubles + '</td>' +
						 '<td>' + result[i].Triples + '</td>' +
						 '<td>' + result[i].HR + '</td>' +
						 '<td>' + result[i].RBI + '</td>' +
						 '<td>' + result[i].SB + '</td>' +
						 '<td>' + result[i].CS + '</td>' +
						 '<td>' + result[i].SO + '</td>' +
						 '<td>' + result[i].Batting_Average + '</td>' +
						 '<td>' + result[i].OBP + '</td>' +
						 '<td>' + result[i].SLG + '</td>' +
						 '<td>' + result[i].OPS + '</td>' +
						 '<td>' + result[i].Awards + '</td>'+ 
						 '</tr>';
					         
					         }
				        responseHTML+= '</table>';
				        res.send(responseHTML);
				    }
			       
			           
			       
			       else
				        res.send('Hi');
			           });
    
});

//Display a Single Pitcher's Stats
app.post('/Views/Pitchers', function (req, res) {
    console.log(req.body);
            connection.query('select * from Arbitration_Pitchers ORDER BY Service_Time DESC', req.body.Name, 
			          function (err, result) {
				       console.log(result);
				       if(result.length > 0) {
					        //create a table
					        var  responseHTML =' <table class="users"><tr><th>Name</th><th>Team</th><th>Type</th><th>Service Time</th><th>Wins</th><th>Losses</th><th>Percent</th><th>ERAs</th><th>G</th><th>GS</th><th>GF</th><th>CG</th><th>SHO</th><th>Saves</th><th>Innings</th><th>H</th><th>Runs</th><th>Earned Runs</th><th>HR</th><th>BB</th><th>IBB</th><th>SO</th><th>Awards</th></tr>';
					   for (var i=0; result.length > i; i++) {

					                responseHTML+= '<tr><td>' +result[i].Name + '</td >' +
					        '<td>' + '<a href="http://www.'+ result[i].Team +'.com/">'+ result[i].Team+' </a></td>' +
					        '<td>' + result[i].Type + '</td >' +
					        '<td>' + result[i].Service_Time + '</td >' +
					        '<td>' + result[i].Wins + '</td >' +
					        '<td>' + result[i].Losses + '</td >' +
					        '<td>' + result[i].Win_Percent + '</td >'+
					        '<td>' + result[i].ERA + '</td >' +
					        '<td>' + result[i].Games + '</td >' +
					        '<td>' + result[i].Games_Started + '</td >' +
					        '<td>' + result[i].Games_Finished + '</td >' +
					        '<td>' + result[i].Complete_Games +  '</td >'+
					        '<td>' + result[i].Shutouts + '</td>' +
					        '<td>' + result[i].Saves + '</td >' +
					        '<td>' + result[i].Innings_Pitched + '</td >' +
					        '<td>' + result[i].Hits + '</td>' +
					        '<td>' + result[i].Runs + '</td >' +
					        '<td>' + result[i].Earned_Runs + '</td >' +
					        '<td>' + result[i].HR + '</td>' +
					        '<td>' + result[i].Walks + '</td>' +
					        '<td>' + result[i].IBB + '</td>' +
					        '<td>' + result[i].SO + '</td>' +
					        '<td>' + result[i].Awards + '</tr >';
					       
					   }
					   responseHTML+= '</table>';
                                           res.send(responseHTML);
                                       }

				      
				      else
					  res.send('Pitcher does not exist.');
				  });
    
});

app.post('/Managers/Update', function (req, res) {
    console.log(req.body);
    var qry1 = "UPDATE Managers SET Name ='" + req.body.NewName +  "' WHERE Current_Team = '" +  req.body.Team + "'";
    //console.log(qry1);
    connection.query (qry1,
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Managers where Name = ?', req.body.NewName, 
			     function (err, result) {
                    if(result.length > 0) {
                      res.send(
                               'New Manager: ' + result[0].Name
                               
 
			       );
                    }
                    else
                      res.send('Player Does Not Exist.');
				 }
			     );
	    }
    );
});

						  
			
			
			 
			 
			 
			 
			 
			 



// Begin listening

app.listen(8024);
console.log("Express server listening on port %d in %s mode", app.settings.env);
