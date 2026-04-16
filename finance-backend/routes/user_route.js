import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import authRoleMiddleware from "../middle_ware/authRoleMiddleware.js";

const secret_key = process.env.SECRET;
console.log(secret_key);
const prisma = new PrismaClient();
const user_route = express.Router();

//Creating user
user_route.post("/create", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const data = req.body;
    if (Array.isArray(data)) {
      const isvalid = data.some(
        (element) => !element.name || !element.email || !element.password,
      );
      if (isvalid) {
        return res.status(400).send("Required fields missing");
      }
      const usersToInsert = await Promise.all(
        data.map(async (user) => ({
          name: user.name,
          email: user.email,
          password: await bcrypt.hash(user.password, 12),
          role: user.role || "VIEWER",
        })),
      );
      const usersData = await prisma.user.createMany({
        data: usersToInsert,
        skipDuplicates: true,
      });

      return res.status(201).json({
        message: "Users created successfully",
        count: usersData.count,
      });
    }

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User is already created using this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return res.status(200).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//User authentication
user_route.post("/user_ver", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status == "INACTIVE") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, secret_key, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });
    res.status(200).json({ message: "User is successfully verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//User logout
user_route.delete("/logout", authRoleMiddleware(), async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });
    return res.status(200).send({ message: "Successfully logged out" });
  } catch (error) {
    res.status(400).send({ message: "we getting error while logging out" });
  }
});

// Soft deleting of users
user_route.delete( "/soft_delete/:id", authRoleMiddleware(["ADMIN"]), async (req, res) => {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required",
        });
      }
      const Is_user_exist = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!Is_user_exist) {
        return res
          .status(404)
          .json({ message: `User with id ${id} is not exist` });
      }
      const deleted_records = await prisma.financialRecord.updateMany({
        where: { userId: Number(id) },
        data: { deleted: true },
      });

      const deleted_user = await prisma.user.update({
        where: { id: Number(id) },
        data: { deleted: true, status: "INACTIVE" }
      });
      res.status(200).json({
        message: `User ${deleted_user.name} with id ${id} is soft deleted successfully `,
        deleted_user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

//Restoring users
user_route.get("/restoring_user/:id", authRoleMiddleware(["ADMIN"]), async (req, res) => {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required",
        });
      }
      const is_user_exist = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!is_user_exist) {
        return res.status(404).json({ message: "User is not found" });
      }
      const is_user_deleted = is_user_exist.deleted;
      if(!is_user_deleted){
         return res.status(200).json({message : "Given user is already restored"})
      }
      const user_restored = await prisma.user.update({
        where : { id : Number(id) },
        data : { status : "ACTIVE", deleted : false}
      })
      res.status(201).json({message : `User wih id ${id} is restored`,user_restored});
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "server error"})
    }
  });

  //Deleting users permanently
  user_route.delete('/delete/:id',authRoleMiddleware(["ADMIN"]),async (req,res)=>{
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required",
        });
      }
      const is_user_exist = await prisma.user.findUnique({
        where : {id : numericId}
      });
      if(!is_user_exist){
        return res.status(404).json({message : "The user is not found"});
      }
      const delete_records  = await prisma.financialRecord.deleteMany({
        where : {userId : numericId}
      });
      const user_deleted_per = await prisma.user.delete({
        where : {id : numericId }
      });
      res.status(201).json({message : `User with id ${id} is deleted permanently`,user_deleted_per});
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "server error"})
    }
  })
  
export default user_route;
