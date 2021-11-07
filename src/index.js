const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const checksRepositoryExists = (request, response, next) => {

  const { params: { id } } = request;

  const repository = repositories.find((repository) => repository.id === id);

	if (!repository){
		return response.status(404).json({ error: "Repository not exists!" });
	}

  request.repository = repository

  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { body: { title, url, techs } } = request;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksRepositoryExists, (request, response) => {
  const { body: { title, url, techs }, repository } = request;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checksRepositoryExists, (request, response) => {
  const { repository: { id } } = request;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", checksRepositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
