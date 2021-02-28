//Side package
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema");
const graphQlResolver = require("./graphql/resolver");
const isAuth = require("./middleware/is-auth");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);

	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolver,
		graphiql: true,
	})
);

mongoose
	.connect(
		`mongodb+srv://Test:${process.env.MONGO_PASSWORD}@cluster0.uzdqp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		app.listen(8080, () => {
			console.log("Connect");
		});
	})
	.catch((err) => {
		console.log(err);
		throw err;
	});
