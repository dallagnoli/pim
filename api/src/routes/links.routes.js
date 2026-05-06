const router = require("express").Router();
const controller = require("../controllers/links.controller");
const { validateLinkInput } = require("../middlewares/validation");

router.get("/", controller.getAll);
router.post("/", validateLinkInput, controller.create);
router.put("/:id", validateLinkInput, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;