const router = require("express").Router();
const controller = require("../controllers/notes.controller");
const { validateNoteInput } = require("../middlewares/validation");

router.get("/", controller.getAll);
router.post("/", validateNoteInput, controller.create);
router.put("/:id", validateNoteInput, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;