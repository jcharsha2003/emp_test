
const exp = require("express");
const app = exp();
const cors=require("cors");
app.use(cors());

app.use(cors({ origin: true }));
app.use(exp.json());
app.listen(5000, () => {
  console.log("server is listening in port 5000");
});
// connecting backend and frontend by server
const path = require("path");
app.use(exp.static(path.join(__dirname,"../client/build")));

require("dotenv/config");


const mclient = require("mongodb").MongoClient;


// connect to mongodb server
mclient
  .connect(process.env.DB_STRING, { useNewUrlParser: true
  })
  .then((dbRef) => {

    // access user database
    let usersdbObj = dbRef.db("usersdb");
    let userCollection = usersdbObj.collection("usercollection");



    console.log("connected to DB successfully");

    // share collections objects to APIs
    app.set("userCollection", userCollection);
    
  })
  .catch((err) => console.log("database connection err is", err));

const userapp = require("./APIs/userApi");


app.use("/user-api", userapp);


// create a middleware to handle invalid path
const invalidPathHandlingMiddleware = (request, response, next) => {
  response.send({ message: "Invalid path" });
};
app.use(invalidPathHandlingMiddleware);

// create err handling middleware
const errHandler = (error, request, response, next) => {
  response.send({ "error-message": error.message });
};
app.use(errHandler);

