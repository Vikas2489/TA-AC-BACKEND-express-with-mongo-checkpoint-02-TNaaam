var express = require("express");
var router = express.Router();
var Remark = require("../models/remarks");
var Event = require("../models/events");

// likes 
router.get("/:id/likes", (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, remark) => {
        if (err) return next(err);
        res.redirect("/events/" + remark.eventId);
    });
});

// edit
router.get("/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Remark.findById(id, (err, remark) => {
        if (err) return next(err);
        res.render("upadteRemarkForm", { remark });
    })
})

// updated Remark
router.post("/:id", (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndUpdate(id, req.body, (err, remark) => {
        if (err) return next(err);
        res.redirect("/events/" + remark.eventId);
    })
})


// delete
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndDelete(id, (err, remark) => {
        if (err) return next(err);
        console.log(remark);
        Event.findByIdAndUpdate(remark.eventId, { $pull: { remarks: remark.id } }, (err, event) => {
            if (err) return next(err);
            console.log(event);
            res.redirect("/events/" + event.id);
        })
    });
});

module.exports = router;