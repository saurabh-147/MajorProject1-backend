var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require("request");
var path = require("path");

var app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://admin-saurabh147:LqC3w6kPkwvXB3xi@cluster0.wkt04.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then((res) => console.log("DB connected"))
  .catch((err) => console.log("OOPS"));

const Question = mongoose.model("Question", { sentence: String });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/addquestion", (req, res) => {
  const sent = req.body.sentence;

  var flag = 0;

  Question.find().then((response) => {
    response.map((ques) => {
      request("http://13.232.231.249/" + ques.sentence + "/" + sent, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          var result = JSON.parse(body);
          console.log(result);
          if (result.val >= 70) {
            // console.log("The string is present in database already.");
            flag = 1;
          }
        }
      });
    });
  });

  setTimeout(() => {
    if (flag == 1) {
      return res.status(200).json({
        msg: "Same  type of Question is alreay present in DB ",
      });
    } else {
      const ques = new Question({ sentence: sent });
      ques.save().then((q) => {
        return res.status(200).json({
          msg: "Question is successuly saved",
        });
      });
    }
  }, 3000);
});

app.listen(3000, () => {
  console.log("Server listening");
});
