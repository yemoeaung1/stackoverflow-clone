const cors = require("cors");
const express = require("express");
const app = express();
const port = 8000;

const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//schemas
const Question = require("./models/questions.js");
const Tag = require("./models/tags.js");
const Answer = require("./models/answers.js");

db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(cors(), express.json());

app.get("/questions", async (req, res) => {
  const questions = await Question.find({});
  //console.log(questions);
  res.send(questions);
});

app.get("/tags", async (req, res) => {
  const tags = await Tag.find({});
  res.send(tags);
});

app.post("/questionform", async (req, res) => {
  try {
    const { question } = req.body;

    const newQuestion = new Question({
      title: question.title,
      text: question.text,
      tags: await getQuestionTags(question.tags),
      answers: question.ansIds,
      asked_by: question.askedBy,
      ask_date_time: question.askDate,
      views: question.views,
    });

    await newQuestion.save();
    res.redirect("/questions");
  } catch (err) {
    console.log(err);
  }
});

app.post("/posts/question/:id/answerform", async (req, res) => {
  try {
    const qId = req.params.id;

    const { answer } = req.body;
    console.log(answer);
    const newAnswer = new Answer({
      text: answer.text,
      ans_by: answer.ans_by,
      ans_date_time: answer.ans_date_time
    });
    console.log(newAnswer);
    console.log(qId);
    await newAnswer.save();

    const updatedQuestion = await Question.updateOne(
      { _id: qId },
      { $push: { answers: newAnswer._id } }
    );
    res.json(updatedQuestion);
    // const updatedQuestion = await Question.findOneAndUpdate(
    //   {_id:qId},
    //   {$push: {answers: newAnswer }},
    //   { new: true });
    //   res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
  }
});

app.get("/posts/question/:id", async (req, res) => {
  try {
    const qId = req.params.id;
    // const question = await Question.findById(qId);
    const question = await Question.findOneAndUpdate(
      { _id: qId },
      { $inc: { views: 1 } },
      {new: true}
    ).exec();
    if (!question) {
      return res.status(404).send("Question not found");
    }
    // question.views +=1;
    await question.save();
    res.send(question);
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/question/:id/answerform", async (req, res) => {
  try {
    const qId = req.params.id;
    const question = await Question.findById(qId);
    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.send(question);
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/answer/:id", async (req, res) => {
  try {
    const aId = req.params.id;
    const answer = await Answer.findById(aId);
    if (!answer) {
      return res.status(404).send("Answer not found");
    }
    res.send(answer);
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/tag/:id", async (req, res) => {
  console.log("Tag Search Post");
  try {
    const tid = req.params.id;
    const tag = await Tag.findById(tid);
    const qArr = await Question.find({ tags: tid });

    res.send({ tag: tag, qArr: qArr });
  } catch (err) {
    console.log(err);
  }
});

const server = app.listen(port, () => {
  console.log(`APP listening on port ${port}`);
});

process.on('SIGTERM', () => {server.close(async () => {
  await db.close();
  console.log('Server closed. Database instance disconnected');
})});
process.on('SIGINT', () => {server.close(async () => {
  await db.close();
  console.log('Server closed. Database instance disconnected');
})});


async function getQuestionTags(tagsArr) {
  let questiontags = [];
  const DBTags = await Tag.find({});
  // console.log(DBTags);
  for (let tag of tagsArr) {
    const existingTag = DBTags.find((DBTag) => DBTag.name === tag);

    if (existingTag) questiontags.push(existingTag._id);
    else {
      const newTagId = await addTagtoDB(tag);
      questiontags.push(newTagId);
    }
  }
  return questiontags;
}

async function addTagtoDB(tag) {
  let newTag = new Tag({
    name: tag,
  });
  await newTag.save();
  return newTag._id;
}
