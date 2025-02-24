const mongoose = require("mongoose");

const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/http5222-a1?retryWrites=true&w=majority&appName=Cluster0`;

//set up Schema and model
const ProjectsSchema = new mongoose.Schema(
  {
    name: mongoose.SchemaTypes.String,
    link: mongoose.SchemaTypes.String,
  },
  { collection: "projects" }
);

const SkillsSchema = new mongoose.Schema(
  {
    name: mongoose.SchemaTypes.String,
  },
  { collection: "skills" }
);

const Projects = mongoose.model("Projects", ProjectsSchema);
const Skills = mongoose.model("Skills", SkillsSchema);

//MONGODB FUNCTIONS
async function connect() {
  await mongoose.connect(dbUrl); //connect to mongodb
}

//Get all projects from the projects collection
async function getProjects() {
  await connect();
  return await Projects.find({});
}

//Get all skills from the skills collection
async function getSkills() {
  await connect();
  return await Skills.find({});
}

//Get one project by id
async function findProject(id) {
  await connect();
  return await Projects.findOne({ _id: id });
}

//Get one skill by id
async function findSkill(id) {
  await connect();
  return await Skills.findOne({ _id: id });
}

//Create one project
async function createProject(name, link) {
  await connect();
  return await Projects.insertOne({ name: name, link: link });
}

//Create one skill
async function createSkill(name) {
  await connect();
  return await Skills.insertOne({ name: name });
}

//Update on project
async function updateProject(id, name, link) {
  await connect();
  await Projects.updateOne({ _id: id }, { name: name, link: link });
}

//Update on skill
async function updateSkill(id, name) {
  await connect();
  await Skills.updateOne({ _id: id }, { name: name });
}

//Delete a project
async function deleteProject(id) {
  await connect();
  await Projects.deleteOne({ _id: id });
}

//Delete a skill
async function deleteSkill(id) {
  await connect();
  await Skills.deleteOne({ _id: id });
}

module.exports = {
  getProjects,
  getSkills,
  findProject,
  findSkill,
  createProject,
  createSkill,
  updateProject,
  updateSkill,
  deleteProject,
  deleteSkill,
};
