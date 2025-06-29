import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage.js";
import { sendMoneySchema } from "../shared/schema.js";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
    const addMoneySchema = z.object({
      amount: z.string().min(1, "Amount is required").refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, "Amount must be greater than 0"),
    });

    const validation = addMoneySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.errors 
      });
    }

    const { amount } = validation.data;
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

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`Error ${status}: ${message}`);
  res.status(status).json({ error: message });
});

export default app;