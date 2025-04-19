"use strict";
const model = require("../models/jokebook.model");

function jokeCategories(req, res, next) {
    try {
        let jokeCategoriesList = model.jokeCategories();
        let joke = model.getRandomJoke();
        res.render('landing', { jokeCategoriesList: model.getAll() });
    } catch (err) {
        console.error("Error while getting categories ", err.message);
        next(err);
    }
}

function getJokesByCategory(req, res, next) {
    let category = req.params.category;
    let limit = req.query.limit;

    try {
        const jokes = model.getJokesByCategory(category, limit);

        if (!jokes || jokes.length === 0) {
            return res.status(404).json({ message: "Category not found or no jokes in category." });
        }

        res.json(jokes);
    } catch (err) {
        console.error("Error while getting jokes: ", err.message);
        next(err);
    }
}

function getRandomJoke(req, res, next) {
    try {
        let joke = model.getRandomJoke();  
        console.log("Got random joke:", joke);

        if (!joke) {
            return res.status(404).json({ error: "No jokes found" });
        }

        res.json(joke);
    } catch (err) {
        console.error("Error while getting random joke:", err.message);
        next(err);
    }
}

function getLandingPage(req, res, next) {
    try {
        let joke = model.getRandomJoke();
        let jokeCategoriesList = model.jokeCategories(); 

        res.render("landing", { joke: joke, title: "Welcome to the Jokebook!", jokeCategoriesList: jokeCategoriesList });
    } catch (err) {
        console.error("Error while getting random joke: ", err.message);
        next(err);
    }
}

function addJoke(req, res, next) {
    let category = req.body.category;
    let setup = req.body.setup;
    let delivery = req.body.delivery;

    if (category && setup && delivery) {
        let params = [category, setup, delivery];

        try {
            const result = model.addJoke(params);

            if (!result) {
                console.error("Category not found."); 
                return res.status(400).send("Category not found.");
            }

            const jokesInCategory = model.getJokesByCategory(category);

            return res.json({
                jokes: jokesInCategory 
            });

        } catch (err) {
            console.error("Error while adding joke:", err.message);
            next(err); 
        }
    } else {
        res.status(400).send("Invalid Request: category, setup, and delivery are required.");
    }
}

module.exports = {
    jokeCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke,
    getLandingPage,
};