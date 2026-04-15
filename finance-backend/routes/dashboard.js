import express from "express";
import authRoleMiddleware from "../middle_ware/authRoleMiddleware.js";
import { PrismaClient } from "@prisma/client";

const secret_key = process.env.SECRET;
const prisma = new PrismaClient();
const dashboard_router = express.Router();

dashboard_router.get("/", authRoleMiddleware(), async (req, res) => {
    try{
  const userId = req.user.id;
  const role = req.user.role;
  //Total income
  const totalIncome = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      userId: userId,
      type: "INCOME",
    },
  });
  //Total expenses
  const totalExpenses = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      userId: userId,
      type: "EXPENSE",
    },
  });
  const income = totalIncome._sum.amount || 0;
  const expense = totalExpenses._sum.amount || 0;
  const netBalance = income - expense;

  //Categorywise total
  const categoryTotal = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    where: { userId },
    _sum: { amount: true },
  });

  //Recent activities ( last 20 activites )
  const recentRecords = await prisma.financialRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  //Monthly trend
  const monthlyTrends = await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('month', "date") AS month,
    "type",
    SUM("amount") as total
  FROM "FinancialRecord"
  WHERE "userId" = ${userId}
  GROUP BY month, "type"
  ORDER BY month ASC;
  `;

  //weekly trend
  const weeklyTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', "date") AS week,
        "type",
        SUM("amount") as total
      FROM "FinancialRecord"
      WHERE "userId" = ${req.user.id}
      GROUP BY week, "type"
      ORDER BY week ASC;
    `;

    //Monthly profit-loss trend
    const monthlyProfitLoss = await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('month', "date") AS month,
    SUM(CASE WHEN "type" = 'INCOME' THEN "amount" ELSE 0 END) as income,
    SUM(CASE WHEN "type" = 'EXPENSE' THEN "amount" ELSE 0 END) as expense,
    SUM(CASE 
        WHEN "type" = 'INCOME' THEN "amount"
        WHEN "type" = 'EXPENSE' THEN -"amount"
        ELSE 0
    END) as profit
  FROM "FinancialRecord"
  WHERE "userId" = ${req.user.id}
  GROUP BY month
  ORDER BY month ASC;
`;

//Profit change comparing by current month vs previous month
const result = [];

for (let i = 0; i < monthlyProfitLoss.length; i++) {
  const current = monthlyProfitLoss[i];
  const previous = monthlyProfitLoss[i - 1];

  let change = null;

  if (previous) {
    const currentProfit = Number(current.profit);
    const prevProfit = Number(previous.profit);

    if (prevProfit !== 0) {
      change = ((currentProfit - prevProfit) / prevProfit) * 100;
      change = Number(change.toFixed(2));
    }
  }

  result.push({
    month: current.month,
    profit: Number(current.profit),
    change
  });
}
  const responses = {
     role,
     totalIncome: income,
      totalExpenses: expense,
      netBalance,
      categoryTotal,
      recentRecords
  }
  if(role != "VIEWER"){
    responses.monthlyTrends = monthlyTrends;
    responses.weeklyTrends = weeklyTrends;
    responses.monthlyProfitLoss = result;
  }
   res.status(200).json(responses);
   } catch(error){
    console.log(error);
    res.status(500).json({message : "Server error"});
   }
});


export default dashboard_router;
