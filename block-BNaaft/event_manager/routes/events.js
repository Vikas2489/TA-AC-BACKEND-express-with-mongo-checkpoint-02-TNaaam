var express = require('express');
var router = express.Router();
var Event = require("../models/events");
var Remark = require("../models/remarks");

/* GET Event Form. */
router.get('/new', function(req, res, next) {
    res.render("eventForm");
});

// list of events
router.get("/", function(req, res, next) {
    Event.find({}, (err, events) => {
        if (err) return next(err);
        res.render("listOfEvents", { events });
    });
});

// post the form
router.post("/", (req, res, next) => {
    req.body.category = req.body.category.trim().split(" ");
    console.log(req.body, "eventFirstTimeCreated");
    Event.create(req.body, (err, event) => {
        if (err) return next(err);
        res.redirect("/events", );
    })
})

// event detail page
router.get("/:id", (req, res, next) => {
    let id = req.params.id;
    Event.findById(id).populate("remarks").exec((err, event) => {
        if (err) return next(err);
        res.render("eventDetails.ejs", { event });
    })
})

// event's list based on specific category
router.get("/:category/category", (req, res, next) => {
    let category = req.params.category;
    Event.find({ category: { $in: [category] } }, (err, events) => {
        if (err) return next(err);
        res.render("categoriesBasedList.ejs", { events });
    })
})


// increament likes
router.get("/:id/likes", (req, res, next) => {
    let id = req.params.id;
    Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + id);
    });
});

function formatDate(date) {
    let year = new Date(date).getFullYear();
    let datee = new Date(date).getDate();
    let month = new Date(date).getMonth();
    if (month < 10) {
        month = "0" + String(month);
    }
    if (datee < 10) {
        datee = "0" + String(datee);
    }
    return `${year}-${month}-${datee}`;
}

// get filled form to update event
router.get("/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Event.findById(id, (err, event) => {
        event.category = event.category.join(" ");
        let start_date = formatDate(String(event.start_date));
        let end_date = formatDate(String(event.end_date));
        if (err) return next(err);
        res.render("updateEventForm", { event, start_date, end_date });
    });
});

// updating event
router.post("/:id", (req, res, next) => {
    let id = req.params.id;
    req.body.category = req.body.category.trim().split(" ");
    Event.findByIdAndUpdate(id, req.body, (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + id);
    })
})

// delete event
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Event.findByIdAndDelete(id, (err, deletedEvent) => {
        if (err) return next(err);
        Remark.deleteMany({ eventId: id }, (err, deletedRemark) => {
            if (err) return next(err);
            res.redirect("/events");
        })
    })
});

// Create An remark
router.post("/:id/remarks", (req, res, next) => {
    let id = req.params.id;
    req.body.eventId = id;
    Remark.create(req.body, (err, remark) => {
        if (err) return next(err);
        Event.findByIdAndUpdate(id, { $push: { remarks: remark.id } }, (err, event) => {
            if (err) return next(err);
            res.redirect("/events/" + id);
        })
    })
})

module.exports = router;