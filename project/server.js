/* File formost of node/express operations */

const express = require('express');
// const { connect } = require('./public/scripts/dbconfig');
const app = express();
var path = require('path')
var http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);

const con = require('./public/scripts/dbconfig');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var bodyParser = require('body-parser'); 
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
const sayHi = require('./public/scripts/dbconfig');
const mysql = require('mysql2');
const { add } = require('nodemon/lib/rules');
var port = process.env.PORT;
var query;
var session_id;
var session_username;
var session_job;
var ticket_id;
var handler_id;
var problem_type_id;
var last_updated;
var software_id;
var ticket_status;

app.use (session ({
    secret: "secret",
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie:{
     maxAge: 1000*60*60 // default session expiration is set to 1 hour
     },
 })
);

//5005

app.get('/', (req, res) =>{
    console.log("WORK")
    res.send("<h1>Hi</h1>")
    // res.render('login.html')

});

app.get('/faq.html', (req, res) =>{
    console.log("faq")
    if(req.session.loggedin) {
    // res.sendFile(path.join(__dirname +  '/faq.html'));
    // res.render('login.html')

    
    
    con.query(`SELECT ticket.problem_description, 'Hardware' as 'prob_name', problem_type.name  
    from ticket INNER JOIN problem_type ON problem_type.problem_type_id = ticket.problem_type_id 
    where links_to LIKE '2%' OR problem_type.problem_type_id = 2 

    UNION ALL

    SELECT ticket.problem_description, 'Software' as 'prob_name', problem_type.name 
    from ticket INNER JOIN problem_type ON problem_type.problem_type_id = ticket.problem_type_id 
    where links_to LIKE '1%' OR problem_type.problem_type_id = 1;`,
    
    function(err, result, fields) {
        if (err) throw err;
        console.log(result);

        if (result.length>0) {
            res.render('faq', {
                dropdownVals: result,
                loggeduser: session_username
               
                // ticket_details: result
    
            });
            //     dropdownVals: query_output,
            //     newdropdownVals: query,
            //     // problem_resolution: result
            // })
        }
        
    });
    con.end();

    io.on('connection',  (socket) => {
        console.log('connected')
        socket.on("solution", (msg) => {
            console.log(parseInt(msg.id));

            con.query(`SELECT solution.solution_description FROM solution 
            INNER JOIN ticket_solution ON solution.solution_id = ticket_solution.solution_id 
            INNER JOIN ticket ON ticket_solution.ticket_id = ticket.ticket_id WHERE solution.solution_description=?;`,
            [parseInt(msg.id)],function(err, result, fields) {
            console.log(err);
            if (err) throw err;

            console.log(result);
            io.send('solution', result);
            })
        });
        })
    con.end();
} else {
    res.send('Please login to view this page!');
} 
res.end();
    
});


app.get('/login.html', (req, res) =>{
    console.log("login")
    res.sendFile(path.join(__dirname +  '/login.html'));
    // res.render('login.html')

});


app.get('/analyst.html', async function (req, res) {
    //res.sendFile(path.join(__dirname +  '/analyst.html'));
    if(req.session.loggedin) {
        console.log("analyst")
        
    

        //Query for first chart
        con.query('SELECT job, COUNT(*) as count FROM employee',function (err, result, fields) {

        if (err) throw err;
        
        query_chart1 = result
        console.log(query_chart1);
        let labs = query_chart1.map(a => a.job)
        let datapoints = query_chart1.map(b => b.count) 
        console.log(typeof labs)

        res.render('analyst', {
            dat1: datapoints,
            dat2: labs
            }) 
    
    })
    } else {
        res.send('Please login to view this page!');
    }
res.end();    
});

app.get('/intspecialist.html', (req, res) => {  
    if(req.session.loggedin) {
        // console.log("internal scpecialist")
        res.render('intSpecialist')
    // res.writeHead(200, {'content-type':'text/html'})
    
    // Query for ticket information

    con.query(`SELECT ticket_id, status, last_updated, problem_type.name, h.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    INNER JOIN employee ON ticket.employee_id = employee.employee_id
    INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
    WHERE ticket.handler_id = ?
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'active' THEN 4
                ELSE 5 END`, 
    [session_id],function (err, result, fields) {
        if (err) throw err;
        // console.log(result);

        query_output = result;

      
    });
   
    // Query to display home page info
    con.query(`SELECT ticket_id, status, problem_type.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    WHERE ticket.handler_id = ?
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'active' THEN 4
                ELSE 5 END`, 
    [session_id],function (err, result, fields) {
        if (err) throw err;

        query = result

        res.render('index', {
            dropdownVals: query_output,
            newdropdownVals: query,
            loggeduser: session_username
        })
       
    });
// ``````condition that executed on calling of socket
    io.on('connection',  (socket) => {
        console.log('connected')
        socket.on("message", (msg) => {
            // console.log(parseInt(msg.id));

            con.query(`SELECT ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler from ticket
            INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
            INNER JOIN  software on ticket.software_id = software.software_id 
            INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
            INNER JOIN (SELECT user_id, employee.name FROM handler
            INNER JOIN employee ON handler.user_id = employee.employee_id
            UNION
            SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
            WHERE ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
            console.log(err);
            if (err) throw err;

            console.log(result);
            io.send('message', result);

        });

        })

    })

    
    io.on('connection',  (socket) => {
        console.log('connected')

        socket.on("update_message", (msg) => {
            console.log(msg);

            con.query(`SELECT problem_type_id from problem_type where name = ?;`,[msg.problem_type],function (err, result, fields) {
                if (err) throw err;
                problem_type_id = result[0].problem_type_id;
                console.log(problem_type_id);
                console.log("HERE");

                 con.query(`SELECT software_id from software where name = ?;`,[msg.software],function (err, result, fields) {
                if (err) throw err;
                software_id = result[0].software_id;
                
           
            con.query(`SELECT user_id from handler INNER JOIN employee ON employee.employee_id  = handler.user_id WHERE employee.name = ?
                    UNION
                    SELECT external_specialist_id AS user_id FROM external_specialist WHERE name = ?`,[msg.handler_name,msg.handler_name],function (err, result, fields) {
                if (err) throw err;
                handler_id = result[0].user_id;


            con.query(`UPDATE ticket 
                SET priority = ?, operating_system = ?, problem_description = ?, notes = ?, hardware_id = ?, software_id = ?, problem_type_id = ?, last_updated =?,  handler_id = ? 
                WHERE ticket_id = ?`, [msg.priority, msg.os, msg.problem_description, msg.notes, parseInt(msg.hardware_id), software_id, problem_type_id, msg.last_updated ,handler_id ,parseInt(msg.id)], function (err, result, fields) {
                
                console.log(problem_type_id);
                console.log("WORK PLEASE");
                // console.log(parseInt(msg.hardware_id));
                // console.log(msg.os);
                // console.log(software_id);
                // console.log(msg.problem_description);
                // console.log(msg.notes);
                // console.log(problem_type_id);
                // console.log(handler_id);
                if (err) throw err;
            });   

            });

        });
    });
        });
        })
    }
    else {
        res.send('Please login to view this page!');
    }
     res.end();
});


app.get('/external.html', (req, res) => {
    if (req.session.loggedin) {
        console.log("external specialist")
        res.render('external')

        //query connection for external specialist and display home page for external specialist
        
        con.query(`SELECT ticket_id, status, problem_type.name, last_updated  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    WHERE ticket.handler_id = 1011
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'active' THEN 4
                ELSE 5 END;`,
        [session_id], function (err, result, fields) {
            if (err) throw err;

            query = result

            res.render('external', {
                dropdownVals: query_output,
                newdropdownVals: query,
                loggeduser: session_username
            })

        });
        io.on('connection', (socket) => {
            console.log('connected')
            socket.on("message", (msg) => {
                console.log(parseInt(msg.id));

                con.query(`SELECT ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler from ticket
            INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
            INNER JOIN  software on ticket.software_id = software.software_id 
            INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
            INNER JOIN (SELECT user_id, employee.name FROM handler
            INNER JOIN employee ON handler.user_id = employee.employee_id
            UNION
            SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
            WHERE ticket_id = ?;`, [parseInt(msg.id)], function (err, result, fields) {
                    console.log(err);
                    if (err) throw err;

                    console.log(result);
                    io.send('message', result);

                });

            })
        })

    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});

app.all('/auth', urlencodedParser, (req, res) =>{
    console.log(req.body);
    let user_in = req.body.username;
    let pass_in = req.body.password;
    if (user_in && pass_in) {
        con.query('SELECT * FROM users WHERE username = ? AND AES_DECRYPT(password, SHA2(?, 256)) = ?', [user_in, user_in, pass_in], function(error, results, fields) {
            if (error) throw error;
			if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = user_in;
                session_username = user_in;
                req.session.save();
                
				// res.send("Success! You are logged in as ", + req.session.username);
                // res.redirect('/home');

                con.query('SELECT user_id FROM users WHERE username = ?', [user_in], function(error, results, fields) {
                    if (error) throw error;

                    if (results.length > 0) {
                        req.session.user_id = results[0].user_id;
                        req.session.save();
                        session_id = req.session.user_id;
                        id_val = results[0].user_id;
                        if (id_val < 2000) {
                            session_job = "External Specialist";
                            return res.redirect('/external.html');
                        } else {
                            con.query('SELECT job FROM employee WHERE employee_id = ?', [id_val], 
                            function(error, results, fields) {
                                if (error) throw error;
                                user_job = results[0].job;
                                 if (user_job == "Specialist") {
                                     session_job = user_job;
                                     return res.redirect('/intspecialist.html');
                                 } else if (user_job == "Analyst") {
                                     session_job = user_job;
                                     return res.redirect('/analyst.html');
                                 } else {
                                     session_job = "Employee";
                                     return res.redirect('/index.html');
                                 }

                    }) 
                        }


			} else {
				res.send('Incorrect Username and/or Password!');
                res.end();
			}			
          
            });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
    });
}});

app.get('/home', (req, res) => {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.get('/changepass.html', (req, res) =>{
    console.log("change pass")
    res.sendFile(path.join(__dirname +  '/changepass.html'));

});

app.get('/account.html', (req, res) =>{
    console.log("account")
    // res.sendFile(path.join(__dirname +  '/account.html'));
    const con = require('./public/scripts/dbconfig');
    if (req.session.loggedin) {
        con.query('SELECT user_id FROM users WHERE username = ?', [req.session.username], function(error, results, fields) {
            if (error) throw error;
			if (results.length > 0) {
                console.log(results[0].user_id);
                id_val = results[0].user_id;
                var query_output = null;
                
                if (id_val > 2000 && id_val < 3000) {
                    con.query('SELECT name, job, department, telephone FROM employee WHERE employee_id = ?', [id_val], 
                    function(error, results, fields) {
                        if (error) throw error;
                        console.log(results);
                        
                        res.render('account', {
                            u_name: results[0].name,
                            u_job: results[0].job,
                            u_dept: results[0].department,
                            u_phone: results[0].telephone
                        })   

                    })
                 } else {
                    con.query('SELECT name FROM external_specialist WHERE external_specialist_id = ?', [id_val], 
                    function(error, results, fields) {
                        if (error) throw error;
                        console.log(results);
                        
                        res.render('account', {
                            u_name: results[0].name,
                            u_job: "External Specialist",
                            u_dept: "",
                            u_phone: ""
                        })   

                 });
                
			    }
        }});

} else {
    res.redirect('/login.html');
}});

app.post('/changepass', (req, res) => {
    console.log(req.body)
    let newpass_in = req.body.newpass;
});

app.get('/index.html', (req, res) => {  
    if (req.session.loggedin) {
    console.log("index")
    // res.writeHead(200, {'content-type':'text/html'})
    
    // Query for ticket information

    con.query(`SELECT ticket_id, status, last_updated, problem_type.name, h.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    INNER JOIN employee ON ticket.employee_id = employee.employee_id
    INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
    WHERE ticket.employee_id = ?
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'active' THEN 4
                ELSE 5 END`, 
    [session_id],function (err, result, fields) {
        if (err) throw err;
        // console.log(result);

        query_output = result;

      
    });
   
    // Query to display home page info
    con.query(`SELECT ticket_id, status, problem_type.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    WHERE ticket.employee_id = ?
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'active' THEN 4
                ELSE 5 END`, 
    [session_id],function (err, result, fields) {
        if (err) throw err;

        query = result

        res.render('index', {
            dropdownVals: query_output,
            newdropdownVals: query,
            loggeduser: session_username
        })
       
    });
// ``````condition that executed on calling of socket
    io.on('connection',  (socket) => {
        console.log('connected')
        socket.on("message", (msg) => {
            console.log(parseInt(msg.id));
            if(msg.status == 'closed'){
                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, closing_time, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler, ticket_solution.solution_status,
                solution.solution_description from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                INNER JOIN  software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                console.log(err);
                if (err) throw err;

                console.log(result);
                io.send('message', result);

                });
            }

            else if(msg.status == 'active' || msg.status == 'dropped'){

                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler
                from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN  software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                console.log(err);
                if (err) throw err;

                console.log(result);
                io.send('message', result);

                });

            }

            else if(msg.status == 'submitted' || msg.status == 'unsuccessful'){

                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler,
                solution.solution_description from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                INNER JOIN software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                console.log(err);
                if (err) throw err;

                console.log(result);
                io.send('message', result);

                });

            }
                })
           


        })


    io.on('connection',  (socket) => {
        console.log('connected')

        socket.on("update_message", (msg) => {
           

            con.query(`SELECT problem_type_id from problem_type where name = ?;`,[msg.problem_type],function (err, result, fields) {
                if (err) throw err;
                problem_type_id = result[0].problem_type_id;
                

                 con.query(`SELECT software_id from software where name = ?;`,[msg.software],function (err, result, fields) {
                if (err) throw err;
                software_id = result[0].software_id;
                
           
            con.query(`SELECT user_id from handler INNER JOIN employee ON employee.employee_id  = handler.user_id WHERE employee.name = ?
                    UNION
                    SELECT external_specialist_id AS user_id FROM external_specialist WHERE name = ?`,[msg.handler_name,msg.handler_name],function (err, result, fields) {
                if (err) throw err;
                handler_id = result[0].user_id;


            con.query(`UPDATE ticket 
                SET priority = ?, operating_system = ?, problem_description = ?, notes = ?, hardware_id = ?, software_id = ?, problem_type_id = ?, last_updated =?,  handler_id = ? 
                WHERE ticket_id = ?`, [msg.priority, msg.os, msg.problem_description, msg.notes, parseInt(msg.hardware_id), software_id, problem_type_id, msg.last_updated ,handler_id ,parseInt(msg.id)], function (err, result, fields) {
                
    
        
                if (err) throw err;
            });   

            });

        });
    });
        });
        })


        io.on('connection',  (socket) => {
            console.log('connected')
    
            socket.on("close_ticket", (msg) => {
                ticket_status = msg.new_status
                console.log(msg);
                console.log(ticket_status); 
                if(ticket_status == 'closed'){

                    con.query(`UPDATE ticket
                    SET status = ?, closing_date = ?, closing_time = ? where ticket_id = ?;`,[msg.new_status, msg.date, msg.time, parseInt(msg.id)],function(err, result, fields) {
         
                    if (err) throw err;
                    
                    if(ticket_status == 'closed'){
                        con.query(`UPDATE ticket_solution
                        SET solution_status = 'successful' where ticket_id = ? and solution_status = 'pending';`,[parseInt(msg.id)],function(err, result, fields) {
                
                        if (err) throw err;

                        });
                    }
                    else if(ticket_status == 'unsuccessful'){
                        con.query(`UPDATE ticket_solution
                        SET solution_status = 'unsuccessful' where ticket_id = ? and solution_status = 'pending';`,[parseInt(msg.id)],function(err, result, fields) {
                
                        if (err) throw err;

                        });
                    }


                });

                }
                
                
            });
            })

    //killall -9 node
    
} else {
    res.redirect('/login.html');
}});


// var port = normalizePort(process.env.PORT);
// app.set('port', port);

server.listen(5005, () => {
    console.log('listening for requests on port 5005');
});

// app.listen(5005, ()=>console.log(' SERVER CONNECTED '))