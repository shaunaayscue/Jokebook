"use strict";
const db = require("./db-conn");

function jokeCategories() {
    let sql = "SELECT category_name FROM Categories;";
    const data = db.all(sql);
    return data;
}

function getJokesByCategory(category, limit) {
    let sql = "SELECT Jokes.setup, Jokes.delivery FROM Jokes JOIN Categories ON Jokes.category_id = Categories.category_id WHERE Categories.category_name = ?";
    let params = [
        category
    ];

    if (limit) {
        sql += " LIMIT ?";
        params.push(parseInt(limit));
    }
    return db.all(sql, ...params);
}

function getRandomJoke() {
    let sql = "SELECT Jokes.setup, Jokes.delivery FROM Jokes ORDER BY RANDOM() LIMIT 1;";
    const item = db.get(sql);
    return item;
}

function addJoke(params) {
    let [
        category,
        setup,
        delivery
    ] = params;

    let categoryIdSql = "SELECT category_id FROM Categories WHERE category_name = ?";
    const categoryRow = db.get(categoryIdSql, category);
    if (!categoryRow) {
        return null;
    }
    let sql = "INSERT INTO Jokes (category_id, setup, delivery) VALUES (?, ?, ?);";
    const info = db.run(sql, [categoryRow.category_id, setup, delivery]);

    return info;
}

module.exports = {
    jokeCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke,
};