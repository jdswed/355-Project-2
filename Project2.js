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


// Main route sends our HTML file
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

app.get('/About', function(req, res) {
    res.render('About');
});

/*
app.get('/Teams', function(req, res){
   connection.query('SELECT * FROM Team',
function(err, result) {
console.log(result)})});
*/

app.use(express.static(__dirname  + '/public'));

// Update MySQL database

/*
app.post('/Batters', function (req, res) {
    console.log(req.body);
            connection.query('select Batter_Name, Team  from Batters where Name = ?', req.body.Batter_Name, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Name: ' + result[0].Batter_Name + '<br />' +
		  	       'Team: ' + result[0].Team
		      );
                    }
                    else
                      res.send('Batter does not exist.');
		});
        
    });
*/

app.post('/Teams', function (req, res) {
    console.log(req.body);
    connection.query('select * from Team', 
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

app.post('/Batters', function (req, res) {
    console.log(req.body);
            connection.query('select * from Batters where Team = ?', req.body.Team, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Batter_Name: ' + result[0].Batter_Name + '<br />' +
					              'Team: ' + result[0].Team + '<br />' +
                           'Position: ' + result[0].Position + '<br />' +
                           'Service Time: ' + result[0].Service_Time + '<br />' +
                           'Games: ' + result[0].Games + '<br />' +
                           'Plate Appearences: ' + result[0].PA + '<br />' +
                           'At Bats : ' + result[0].AB + '<br />' +
                           'Runs: ' + result[0].Runs + '<br />' +
                           'Hits: ' + result[0].Hits + '<br />' +
                           'Doubles: ' + result[0].Doubles + '<br />' +
                           'Triples: ' + result[0].Triples + '<br />' +
                           'HomeRuns: ' + result[0].HR + '<br />' +
                           'RBI: ' + result[0].RBI + '<br />' +
                           'SB: ' + result[0].SB + '<br />' +
                           'CS: ' + result[0].CS + '<br />' +
                           'Strikeouts: ' + result[0].SO + '<br />' +
                           'Batting Average: ' + result[0].Batting_Average + '<br />' +
                           'On Base Percentage: ' + result[0].OBP + '<br />' +
                           'Slugging Percentage: ' + result[0].SLG + '<br />' +
                           'On Base Slugging: ' + result[0].OPS + '<br />' +
                           'Awards: ' + result[0].Awards 
					             );
                    }
                    else
                      res.send('Team does not exist Silly.');
				 });
        
    });

app.post('/Pitchers', function (req, res) {
    console.log(req.body);
            connection.query('select * from Pitchers where Name = ?', req.body.Name, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Name: ' + result[0].Name + '<br />' +
					              'Team: ' + result[0].Team + '<br />' +
                           'Type: ' + result[0].Type + '<br />' +
                           'Service Time: ' + result[0].Service_Time + '<br />' +
                           'Wins: ' + result[0].Wins + '<br />' +
                           'Losses: ' + result[0].Losses + '<br />' +
                           'Winning Percentage: ' + result[0].Win_Percent + '<br />' +
                           'ERA: ' + result[0].ERA + '<br />' +
                           'Games: ' + result[0].Games + '<br />' +
                           'Games Started: ' + result[0].Games_Started + '<br />' +
                           'Games Finished: ' + result[0].Games_Finished + '<br />' +
                           'Complete Games: ' + result[0].Complete_Games + '<br />' +
                           'Shutouts: ' + result[0].Shutouts + '<br />' +
                           'Saves: ' + result[0].Saves + '<br />' +
                           'Innings: ' + result[0].Innings_Pitched + '<br />' +
                           'Hits: ' + result[0].Hits + '<br />' +
                           'Runs: ' + result[0].Runs + '<br />' +
                           'Earned Runs: ' + result[0].Earned_Runs + '<br />' +
                           'Home Runs: ' + result[0].HR + '<br />' +
                           'Walks: ' + result[0].Walks + '<br />' +
                           'Intentional Walks: ' + result[0].IBB + '<br />' +
                           'Strikeouts: ' + result[0].SO + '<br />' +
                           'Awards: ' + result[0].Awards 
					             );
                    }
                    else
                      res.send('Pitcher does not exist.');
				 });
        
    });
/*
app.post('/Pitchers', function (req, res) {
    console.log(req.body);
            connection.query('select * from Pitchers where Team = ?', req.body.Team, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Name: ' + result[0].Name + 'br />' );
                    }
                    else
                      res.send('Team does not exist.');
				 });
        
    });*/
app.post('/Team', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Teams  SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select Name, Num_Championships from Team where Name = ?', req.body.Name, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Team: ' + result[0].Name + '<br />' +
		  	       'Number of Championships: ' + result[0].Num_Championships
		      );
                    }
                    else
                      res.send('The Team  was not able to be inserted.');
		});
        }
    );
});

// Begin listening

app.listen(8024);
console.log("Express server listening on port %d in %s mode", app.settings.env);
