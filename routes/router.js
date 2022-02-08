
app.post('/login', (req, res) =>{
    res.sendFile(__dirname + '/public/loggedin.html')
    //res.send(req.query.username)
  })