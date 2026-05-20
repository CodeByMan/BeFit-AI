const express = require('express');
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const admin = require("../controllers/adminController.js");

// USERS
router.get("/users", protect([1]), admin.getAllUsers);
router.get("/users/deleted", protect([1]), admin.getDeletedUsers);
router.patch("/users/soft-delete/:id", protect([1]), admin.softDeleteUser);
router.patch("/users/restore/:id", protect([1]), admin.restoreUser);
router.delete("/users/delete/:id", protect([1]), admin.permanentDeleteUser);

// BLOGS
router.post("/blogs", protect([1]), admin.createBlog);
router.get("/blogs", protect([1]), admin.getBlogs);
router.put("/blogs/:id", protect([1]), admin.updateBlog);
router.delete("/blogs/:id", protect([1]), admin.deleteBlog);

// PROFILE
router.get("/profile", protect([1]), admin.getAdminProfile);
router.put("/profile", protect([1]), admin.updateAdminProfile);
router.put("/profile/password", protect([1]), admin.updateAdminPassword);


module.exports = router;
