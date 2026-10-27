import { Router } from 'express'
import{ createTask, getTasks,getTaskById, updateTask, deleteTask, queryTasks } from "../controller/task.controller.js";

const router = Router();

router.route('/create').post(createTask);
router.route('/getTasks').get(getTasks);
router.route('/query').get(queryTasks);
router.route('/:id').get(getTaskById);
router.route('/update/:id').patch(updateTask);
router.route('/delete/:id').delete(deleteTask);


export default router;