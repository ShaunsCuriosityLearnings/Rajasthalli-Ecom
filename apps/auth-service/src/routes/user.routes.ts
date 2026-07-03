import { Router } from "express";
import clerkClient from "../utils/clerk.js";

const router: Router = Router();

// GET all users (returns raw Clerk users directly)
router.get("/", async (req, res) => {
  try {
    const response = await clerkClient.users.getUserList();
    // Support both direct array and paginated response structure ({ data: [...] })
    const clerkUsers = Array.isArray(response) ? response : (response.data || []);
    res.status(200).json(clerkUsers);
  } catch (error: any) {
    console.error("Error fetching users from Clerk:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await clerkClient.users.getUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser: CreateParams = req.body;
    const user = await clerkClient.users.createUser(newUser);

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await clerkClient.users.deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error(`Error deleting user ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
});

export default router;