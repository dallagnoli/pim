const router = require("express").Router();
const controller = require("../controllers/ideas.controller");
const { validateIdeaInput } = require("../middlewares/validation");

router.get("/", controller.getAll);
router.post("/", validateIdeaInput, controller.create);
router.put("/:id", validateIdeaInput, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;