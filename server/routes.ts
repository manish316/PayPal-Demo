import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendMoneySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (demo user with ID 1)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Get user's payment methods
  app.get("/api/payment-methods", async (req, res) => {
    try {
      const paymentMethods = await storage.getPaymentMethodsByUserId(1);
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  // Get user's transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUserId(1);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Send money
  app.post("/api/send-money", async (req, res) => {
    try {
      const validation = sendMoneySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validation.error.errors 
        });
      }

      const { recipientEmail, amount, note } = validation.data;
      const currentUser = await storage.getUser(1);
      
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentBalance = parseFloat(currentUser.balance);
      const sendAmount = parseFloat(amount);

      if (currentBalance < sendAmount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        userId: 1,
        type: "send",
        amount: amount,
        description: note || "Money sent",
        recipientName: recipientEmail,
        recipientEmail: recipientEmail,
        merchantName: null,
        orderId: null,
        status: "completed",
      });

      // Update user balance
      const newBalance = (currentBalance - sendAmount).toFixed(2);
      await storage.updateUserBalance(1, newBalance);

      res.json({ 
        success: true, 
        transaction,
        message: `Successfully sent $${amount} to ${recipientEmail}` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send money" });
    }
  });

  // Add money from bank
  app.post("/api/add-money", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const currentUser = await storage.getUser(1);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentBalance = parseFloat(currentUser.balance);
      const addAmount = parseFloat(amount);
      
      // Create transaction
      const transaction = await storage.createTransaction({
        userId: 1,
        type: "add_money",
        amount: amount,
        description: "Added Money",
        recipientName: null,
        recipientEmail: null,
        merchantName: null,
        orderId: null,
        status: "completed",
      });

      // Update user balance
      const newBalance = (currentBalance + addAmount).toFixed(2);
      await storage.updateUserBalance(1, newBalance);

      res.json({ 
        success: true, 
        transaction,
        message: `Successfully added $${amount} to your account` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to add money" });
    }
  });

  // Request money (placeholder)
  app.post("/api/request-money", async (req, res) => {
    try {
      const { recipientEmail, amount, note } = req.body;
      
      // In a real app, this would send a request to the recipient
      res.json({ 
        success: true, 
        message: `Money request sent to ${recipientEmail} for $${amount}` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to request money" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
