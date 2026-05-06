const router = require("express").Router();
const controller = require("../controllers/tasks.controller");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.patch("/:id", controller.toggle);

module.exports = router;