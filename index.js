const express = require("express");
const path = require("path"); //needed when setting up static/file paths
const dotenv = require("dotenv");
const pug = require("pug");

//load the environment variables from .env
if (process.env.ENV === "dev") {
  dotenv.config();
}

const db = require("./modules/portfolio/db"); //load db.js

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
  response.render("index");
});

app.get("/admin/projects", async (request, response) => {
  const projects = await db.getProjects();
  response.render("admin/projects/index", { projects: projects });
});

app.get("/admin/skills", async (request, response) => {
  const skills = await db.getSkills();
  response.render("admin/skills/index", { skills: skills });
});

app.get("/admin/projects/new", async (request, response) => {
  response.render("admin/projects/new");
});

app.get("/admin/skills/new", async (request, response) => {
  response.render("admin/skills/new");
});

app.post("/admin/projects/add", async (request, response) => {
  const project = await db.createProject(
    request.body.projectname,
    request.body.projectlink
  );
  response.redirect(`/admin/projects/${project._id}`);
});

app.post("/admin/skills/add", async (request, response) => {
  const skill = await db.createSkill(request.body.skillname);
  response.redirect(`/admin/skills/${skill._id}`);
});

app.get("/admin/projects/:id/edit", async (request, response) => {
  const id = request.params.id;
  const project = await db.findProject(id);
  response.render("admin/projects/edit", { project: project });
});

app.get("/admin/skills/:id/edit", async (request, response) => {
  const id = request.params.id;
  const skill = await db.findSkill(id);
  response.render("admin/skills/edit", { skill: skill });
});

app.post("/admin/projects/:id/update", async (request, response) => {
  const id = request.params.id;
  await db.updateProject(
    id,
    request.body.projectname,
    request.body.projectlink
  );
  response.redirect(`/admin/projects/${id}`);
});

app.post("/admin/skills/:id/update", async (request, response) => {
  const id = request.params.id;
  await db.updateSkill(id, request.body.skillname);
  response.redirect(`/admin/skills/${id}`);
});

app.get("/admin/projects/:id/confirm-delete", async (request, response) => {
  const id = request.params.id;
  const project = await db.findProject(id);
  response.render("admin/projects/confirm-delete", { project: project });
});

app.get("/admin/skills/:id/confirm-delete", async (request, response) => {
  const id = request.params.id;
  const skill = await db.findSkill(id);
  response.render("admin/skills/confirm-delete", { skill: skill });
});

app.post("/admin/projects/:id/delete", async (request, response) => {
  const id = request.params.id;
  await db.deleteProject(id);
  response.redirect(`/admin/projects`);
});

app.post("/admin/skills/:id/delete", async (request, response) => {
  const id = request.params.id;
  await db.deleteSkill(id);
  response.redirect(`/admin/skills`);
});

app.get("/admin/projects/:id", async (request, response) => {
  const id = request.params.id;
  const project = await db.findProject(id);
  response.render("admin/projects/details", { project: project });
});

app.get("/admin/skills/:id", async (request, response) => {
  const id = request.params.id;
  const skill = await db.findSkill(id);
  response.render("admin/skills/details", { skill: skill });
});

app.get("/api/projects", async (request, response) => {
  const projects = await db.getProjects();
  response.send(projects);
});

app.get("/api/skills", async (request, response) => {
  const skills = await db.getSkills();
  response.send(skills);
});

if (process.env.ENV === "dev") {
  //set up server listening
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
} else {
  module.exports = {
    app,
  };
}
