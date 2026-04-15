import express from "express";
import authRoleMiddleware from "../middle_ware/authRoleMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const record_route = express.Router();

//creating record
record_route.post("/create", authRoleMiddleware(["ADMIN"]), async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const data = req.body;
    if(Array.isArray(data)){
      const isvalid = data.some((element)=> !element.amount || !element.type || !element.category || !element.date || !element.viewer_Id);
      if(isvalid){
         return res.status(400).json({
             message: "Required fields missing"
          });
      }
      const recordsToInsert = await Promise.all(
        data.map(async (record)=>({
          amount : record.amount,
          type : record.type,
          category : record.category,
          date : record.date ? new Date(record.date) : undefined,
          notes : record.notes,
          userId : record.viewer_Id
        }))
      )
      const records = await prisma.financialRecord.createMany({
        data: recordsToInsert,
        skipDuplicates: true, 
      });
      return res.status(201).json({
         message : "Records created successfully",records
        });
    }
    const { amount, type, category, date, notes , viewer_Id } = req.body;
    if (!amount || !type || !category || !date || !viewer_Id) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }
    const newRecord = await prisma.financialRecord.create({
      data: {
        amount,
        type,
        category,
        date: date ? new Date(date) : undefined,
        notes,
        userId :viewer_Id
      },
    });
    res.status(201).json({
      message: "Record created successfully",
      newRecord
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//Get all records
record_route.get("/records", authRoleMiddleware([]), async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await prisma.financialRecord.findMany({
      where: {
        userId: userId,
        deleted : false
      },
      orderBy: {
        date: "desc",
      },
    });
    if(records.length == 0){
      return res.status(404).json({message : "No record found"})
    }
    res.status(200).json({
      message: "User records retrieved successfully",
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Get single record
record_route.get("/records/:id", authRoleMiddleware([]), async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id)
    if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required"
        });
      }
    const record = await prisma.financialRecord.findUnique({
      where: {
        id: Number(id),
        deleted : false
      }
    });
    if(!record){
      return res.status(404).json({message : `No record exist on id ${id}`})
    }
    res.status(200).json({ 
      message: "Selected record retrieved successfully", record 
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


//Updating record
record_route.patch("/update", authRoleMiddleware(["ADMIN"]), async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { id, amount, type, category, date, notes } = req.body;
    const record = await prisma.financialRecord.findUnique({
      where: { id: Number(id) },
    });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    const updated_record = await prisma.financialRecord.update({
      where: { id: Number(id) },
      data: {
        ...(amount !== undefined && { amount }),
        ...(type && { type }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
      },
    });
    res.status(200).json({
      message: "Record updated successfully",
      data: updated_record,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Soft deleting record
record_route.delete("/soft_delete/:id", authRoleMiddleware(["ADMIN"]), async (req, res) => {
    try {
      const { id } = req.params;
      const numericId = Number(id)
      if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required"
        });
      }
      const record = await prisma.financialRecord.findUnique({
        where: { id: Number(id) , deleted : false }
      });
      if (!record) {
        res.status(404).json({ message: "Record not found" });
      }
      const deleted_record = await prisma.financialRecord.update({
        where: { id: Number(id) },
        data : {deleted : true}
      });
      res.status(200).json({
        message: "Record soft deleted successfully deleted",
        deleted_record,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

//Restoring deleted records
record_route.get('/restoring_record/:id',authRoleMiddleware(["ADMIN"]),async (req,res)=>{
      try {
          const { id } = req.params;
          const numericId = Number(id)
          if (!id || isNaN(numericId)) {
              return res.status(400).json({
                  message: "Valid User ID is required"
              });
            }
          const isRecordexist = await prisma.financialRecord.findUnique({
            where : {id : Number(id)}
          });
          if(!isRecordexist){
            return res.status(400).json({message : "Record is not found"})
          }
          const isdeleted = isRecordexist.deleted; 
          if(!isdeleted){
            return res.status(200).json({message : "Given record is already restored"})
          }
          const restored_record = await prisma.financialRecord.update({
            where : { id : Number(id)},
            data : { deleted : false}
          })
           res.status(201).json({message : `Record with id ${id} is successfully restored`});
      } catch (error) {
           console.log(error);
           res.status(500).json({message : "server error"})
      }
})
//Filtering records based on criteria
record_route.post("/records", authRoleMiddleware(), async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    let { type, category, startDate, endDate, minAmount, maxAmount } = req.body;
    if (!startDate && !endDate) {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 30);

      startDate = lastMonth;
      endDate = today;
    }


    console.log(req.user.id);
    const records = await prisma.financialRecord.findMany({
      where: {
        userId: req.user.id,

        // Filter by enum
        ...(type && { type }),

        // Filter by category
        ...(category && { category }),

        // Filter by date range
        ...(startDate || endDate
          ? {
              date: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),

        // Filter by amount range
        ...(minAmount || maxAmount
          ? {
              amount: {
                 ...(minAmount !== undefined && { gte: parseFloat(minAmount) }),
                 ...(maxAmount !== undefined && { lte: parseFloat(maxAmount) }),
              },
            }
          : {}),
      },

      orderBy: {
        date: "desc",
      },
      take: 30,
    });

    res.status(200).json({ message: "Records filtered successfully", records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Deleting record permanantely
record_route.delete('/delete/:id',authRoleMiddleware(["ADMIN"]),async (req,res)=>{
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (!id || isNaN(numericId)) {
        return res.status(400).json({
          message: "Valid User ID is required",
        });
      }
      const is_record_exist = await prisma.financialRecord.findUnique({
        where : {id : numericId}
      });
      if(!is_record_exist){
        return res.status(404).json({message : "The record is not found"});
      }
      const delete_records  = await prisma.financialRecord.delete({
        where : {id : numericId}
      });
      res.status(201).json({message : `Record with id ${id} is deleted permanently`,delete_records});
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "server error"})
    }
  })


export default record_route;
