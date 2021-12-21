const express = require('express');
const cors = require('cors');
var fs = require('fs')
const rateLimit = require('express-rate-limit');
const {TokenAddr} = require('./TokenAddr')
const http = require("https");
const https = require('https');

var key  = fs.readFileSync('keys/private.key', 'utf8');
var cert = fs.readFileSync('keys/certificate.crt', 'utf8');
var serverOptions = {
  key: key,
  cert: cert
};

const app = express();

app.use(cors());
app.use(express.json());

async function getAnyAvailableIndex0(tokens) {
  return new Promise(function(resolve, reject) {

    var options = {
      "method": "POST",
      "hostname": "main.ton.dev",
      "port": null,
      "path": "/graphql",
      "headers": {
        "content-type": "application/json",
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);

        let json = JSON.parse(body);

        if (json.data.accounts.length<64) resolve(true)
        resolve(false)
      });
    });
    let str1 = ""
    for (let i = 0; i<tokens.length-1; i++){
      str1+="\\\""+tokens[i]+"\\\","
    }
    str1+="\\\""+tokens[tokens.length-1]+"\\\""
    req.write("{\"query\": \"query { accounts( filter: { id: {in:["+str1+ "]}, acc_type: { eq: 1 }}) { acc_type }}\"}");
    req.end();
  });

}

async function getAnyAvailableIndex1(tokens) {
  return new Promise(function(resolve, reject) {

    var options = {
      "method": "POST",
      "hostname": "main.ton.dev",
      "port": null,
      "path": "/graphql",
      "headers": {
        "content-type": "application/json",
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);

        let json = JSON.parse(body);

        if (json.data.accounts.length<16) resolve(true)
        resolve(false)
      });
    });
    let str1 = ""
    for (let i = 0; i<tokens.length-1; i++){
      str1+="\\\""+tokens[i]+"\\\","
    }
    str1+="\\\""+tokens[tokens.length-1]+"\\\""
    req.write("{\"query\": \"query { accounts( filter: { id: {in:["+str1+ "]}, acc_type: { eq: 1 }}) { acc_type }}\"}");
    req.end();
  });
}

async function getAnyAvailableIndex2(tokens) {
  return new Promise(function(resolve, reject) {

    var options = {
      "method": "POST",
      "hostname": "main.ton.dev",
      "port": null,
      "path": "/graphql",
      "headers": {
        "content-type": "application/json",
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);

        let json = JSON.parse(body);

        if (json.data.accounts.length<4) resolve(true)
        resolve(false)
      });
    });
    let str1 = ""
    for (let i = 0; i<tokens.length-1; i++){
      str1+="\\\""+tokens[i]+"\\\","
    }
    str1+="\\\""+tokens[tokens.length-1]+"\\\""
    req.write("{\"query\": \"query { accounts( filter: { id: {in:["+str1+ "]}, acc_type: { eq: 1 }}) { acc_type }}\"}");
    req.end();
  });

}

async function getAnyAvailableIndex3(token) {
  return new Promise(function(resolve, reject) {

    var options = {
      "method": "POST",
      "hostname": "main.ton.dev",
      "port": null,
      "path": "/graphql",
      "headers": {
        "content-type": "application/json",
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
 
        let json = JSON.parse(body);

        if (json.data.accounts.length==0) resolve(true)
        resolve(false)
      });
    });

    req.write("{\"query\": \"query { accounts( filter: { id: {eq:\\\""+token+ "\\\"}, acc_type: { eq: 1 }}) { acc_type }}\"}");
    req.end();
  });

}

async function wrapper1(str) {
  const tokens = TokenAddr.tokens1
  let res = ""
  if (str[0] >= '0' && str[0] <= '4') {
    for (let i = 0; i< 4 ; i++){
      if (await getAnyAvailableIndex1(tokens[str[0]][i])) {
          res+=i
      }
    }
  } else res = "error"
  return res
}

async function wrapper2(str) {
  const tokens = TokenAddr.tokens2
  let res = ""
  if (str[0] >= '0' && str[0] <= '4' && str[1] >= '0' && str[1] <= '4') {
    for (let i = 0; i< 4 ; i++){
      if (await getAnyAvailableIndex2(tokens[str[0]][str[1]][i])) {
          res+=i
      }
    }
  } else res = "error"
  return res
}

async function wrapper3(str) {
  const tokens = TokenAddr.tokens2
  let res = ""
  if (str[0] >= '0' && str[0] <= '4' && str[1] >= '0' && str[1] <= '4' && str[2] >= '0' && str[2] <= '4') {
    for (let i = 0; i< 4 ; i++){
      if (await getAnyAvailableIndex3(tokens[str[0]][str[1]][str[2]][i])) {
          res+=i
      }
    }
  } else res = "error"
  return res
}

app.get('/', (req, res) => {
  res.json({
    message: 'hi',
  });
});

app.get('/img/:file', (req, res) => {
  if(req.params.file.length==4) {
    try {
      const buf = fs.readFileSync('./img/'+req.params.file+'.png').toString('base64')
      res.type('text/plain')
      res.send(buf)
    } catch (e) {
      res.status(400)

      res.json({
        error: "no file found"
      });
    }
  } else {
    res.status(400)
    res.json({
      error: "no file found"
    });
  }
});

app.get('/ids/', function (request, resIds) {
  const tokens = TokenAddr.tokens0
  getAnyAvailableIndex0(tokens[0]).then(
    value => {
      if (value) ids+="0"
      getAnyAvailableIndex0(tokens[1]).then(
        value => {
          if (value) ids+="1"
          getAnyAvailableIndex0(tokens[2]).then(
            value => {
              if (value) ids+="2"
              getAnyAvailableIndex0(tokens[3]).then(
                value => {
                  if (value) ids+="3"
                  resIds.type('text/plain')
                  resIds.send(ids)
                }
              )
            }
          )
        }
      )
    }
  )
})

  app.get('/ids/:id', function (req, res) {
  if((req.params.id.length<4)){
    if (req.params.id.length == 1) {
      wrapper1(req.params.id).then(
        value => {
          res.type('text/plain')
          res.send(value)
        }
      )
    } else if (req.params.id.length == 2) {
      wrapper2(req.params.id).then(
        value => {
          res.type('text/plain')
          res.send(value)
        }
      )
    } else if (req.params.id.length == 3) {
      wrapper3(req.params.id).then(
        value => {
          res.type('text/plain')
          res.send(value)
        }
      )
    }

  }else {
    res.status(400)
    res.json({
      error: "wrong ids"
    });
  }
})

app.use(rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 60
}));

app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message
  });
});

var server = https.createServer(serverOptions, app);

server.listen(5000, () => {
  console.log("server starting on port : 5000")
});
