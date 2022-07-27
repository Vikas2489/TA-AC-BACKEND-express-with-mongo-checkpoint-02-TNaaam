var express = require('express');
var router = express.Router();
var Event = require("../models/events");

/* GET home page. */
router.get("/", (req, res, next) => {
    res.render("index");
})

// based on search
router.get('/search', function(req, res, next) {
    let query = req.query;
    Event.find(query, (err, events) => {
        if (err) return next(err);
        res.render("categoriesBasedList", { events });
    });
});

// based on date
router.get("/date", (req, res, next) => {
    let query = req.query;
    Event.find({ start_date: { $gt: query.start_date }, end_date: { $lt: query.end_date } }, (err, events) => {
        if (err) return next(err);
        res.render("categoriesBasedList", { events });
    });
})



module.exports = router;