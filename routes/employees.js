var express = require("express");
var router = express.Router("employees");
router.use(express.json());

var employees = require("../public/employees.json");
router.get("", (request, response) => {
  //   console.log(request.query);
  //   const {
  //     query: {key1, key2, key3...},
  //   } = request;
  response.send(employees);
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) return response.sendStatus(404);
  response.send(employee);
});

router.get("/:id/edit", (request, response) => {
  const id = request.params.id;
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) return response.sendStatus(404);
  // response.send(employee);

  response.render("form", {
    title: "Edit Employee",
    empId: "xxx",
  });
});

router.post("/add", (request, response) => {
  // const empId = Math.floor(Math.random() * 1000) + 1;
  const { body } = request;
  // const newEmployee = { ...body, id: empId.toString() };
  employees.push(body);
  return response.status(201).send(employees);
});

// put = update all
router.put("/update/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const empIndex = employees.findIndex((emp) => emp.id === id);
  if (empIndex === -1)
    return response.status(404).send("Bad request: ID not found ");

  employees[empIndex] = { id: id, ...body };
  return response.status(200).send(employees);
});

// patch = update partial fields
router.patch("/update/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const empIndex = employees.findIndex((emp) => emp.id === id);
  if (empIndex === -1)
    return response.status(404).send("Bad request: ID not found ");

  employees[empIndex] = { ...employees[empIndex], ...body };
  return response.status(200).send(employees);
});

router.post("/delete", (request, response) => {
  const { body } = request;

  const remaining = employees.filter((employee) => {
    return !body.some((emp) => emp.id === employee.id);
  });
  employees = remaining;
  response.send(employees);

  // return response.status(200).send(body);
});

router.delete("/delete/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const empIndex = employees.findIndex((emp) => emp.id === id);
  if (empIndex === -1)
    return response.status(404).send("Bad request: ID not found " + id);

  employees.splice(empIndex, 1);
  return response.status(200).send(employees);
});

module.exports = router;
