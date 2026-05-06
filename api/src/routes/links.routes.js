const router = require("express").Router();
const controller = require("../controllers/links.controller");

router.get("/", controller.getAll);
router.post("/", controller.create);

module.exports = router;