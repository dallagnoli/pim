const router = require("express").Router();
const controller = require("../controllers/tasks.controller");
const { validateTaskInput } = require("../middlewares/validation");

router.get("/", controller.getAll);
router.post("/", validateTaskInput, controller.create);
router.put("/:id", validateTaskInput, controller.update);
router.delete("/:id", controller.remove);
router.patch("/:id/toggle", controller.toggle);

module.exports = router;