const router = require("express").Router();
const gradeController = require("../controllers/gradeController");
const { authenticate, authorize } = require("../middleware/authen");

router.use(authenticate);
router.use(authorize(['admin', 'teacher', 'student']));

router.post("/", authorize(['teacher']), gradeController.createGrade);
router.get("/", gradeController.getAllGrades);
router.get("/:id", gradeController.getGradeById);
router.patch("/:id", authorize(['teacher']), gradeController.updateGrade);
router.delete("/:id", authorize(['teacher']), gradeController.deleteGrade);

module.exports = router;