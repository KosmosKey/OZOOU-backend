// Setting up the dependencies
const express = require("express");
const postgress = require("../helpers/connection");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.get("/getListOfTodos", (req, res) => {
  // Postgress query select all todos
  postgress.query(`SELECT * FROM todo`, (err, result) => {
    // If error return error
    if (err) return res.status(400).send({ message: "Something went wrong!" });

    // Else return OK status with data
    res
      .status(200)
      .send({ message: "Successfully fetched data", data: result.rows });
  });

  const date = new Date();
  console.log(date.toDateString());

  // Postgress end
  postgress.end;
});

router.post("/createTodo", (req, res) => {
  // Setting up all request body values that we will use
  const { title } = req.body;

  // If not title then give error
  if (!title)
    return res.status(400).send({ message: "Please fill out all the forms" });

  // Random ID generator
  const id = uuidv4();

  // New Date
  const date = new Date();

  // Else create a Todo
  postgress.query(
    `INSERT INTO todo(
        id, title, status, created_at)
        VALUES ('${id}', '${title}', 'pending', '${date}');`,
    (err, result) => {
      // If error return Error
      if (err)
        return res
          .status(400)
          .send({ message: "Something went wrong!", data: err });

      // Else send the results
      res.send({ message: "Successfully fetched data", data: result.rows });
    }
  );

  // Postgress end
  postgress.end;
});

router.put("/updateTodoStatus", (req, res) => {
  // This function is going to toggle todo
  // If pending then update to completed
  // If completed then update to pending

  // Req body values
  const { id, status } = req.body;

  // If not id or status then return error
  if (!id || !status)
    return res
      .status(400)
      .send({ message: "Please don't forget to give a id or status" });

  // Else update the value
  postgress.query(
    `UPDATE public.todo
	SET status='${status === "pending" ? "completed" : "pending"}'
	WHERE id='${id}'`,
    (err, result) => {
      // If err return Error
      if (err)
        return res
          .status(400)
          .send({ message: "Something went wrong", data: err });

      // Else send the results
      res.send({ message: "Successfully fetched data", data: result.rows });
    }
  );
});

module.exports = router;
