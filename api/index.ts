import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Storage implementation
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  balance: string;
  createdAt: Date;
}

interface PaymentMethod {
  id: number;
  userId: number;
  type: "card" | "bank";
  provider: string;
  lastFour: string;
  expiryDate: string | null;
  bankName: string | null;
  isPrimary: boolean;
  isActive: boolean;
}

interface Transaction {
  id: number;
  userId: number;
  type: "send" | "receive" | "add_money";
  amount: string;
  description: string;
  recipientEmail?: string;
  status: "completed" | "pending" | "failed";
  createdAt: Date;
}

// In-memory storage
class MemStorage {
  private users: Map<number, User> = new Map();
  private paymentMethods: Map<number, PaymentMethod> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private currentUserId = 2;
  private currentPaymentMethodId = 4;
  private currentTransactionId = 4;

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "manishgupta",
      email: "manish.gupta@email.com",
      name: "Manish Gupta",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      balance: "1284.50",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);

    // Create demo payment methods
    const demoPaymentMethods: PaymentMethod[] = [
      {
        id: 1,
        userId: 1,
        type: "card",
        provider: "visa",
        lastFour: "4242",
        expiryDate: "12/25",
        bankName: null,
        isPrimary: true,
        isActive: true,
      },
      {
        id: 2,
        userId: 1,
        type: "card",
        provider: "mastercard",
        lastFour: "8888",
        expiryDate: "08/26",
        bankName: null,
        isPrimary: false,
        isActive: true,
      },
      {
        id: 3,
        userId: 1,
        type: "bank",
        provider: "bank",
        lastFour: "1234",
        expiryDate: null,
        bankName: "Chase Bank",
        isPrimary: false,
        isActive: true,
      },
    ];

    demoPaymentMethods.forEach(pm => this.paymentMethods.set(pm.id, pm));

    // Create demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: 1,
        userId: 1,
        type: "receive",
        amount: "50.00",
        description: "Payment from Sarah Johnson",
        recipientEmail: "sarah.johnson@email.com",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        userId: 1,
        type: "send",
        amount: "25.75",
        description: "Lunch payment",
        recipientEmail: "mike.chen@email.com",
        status: "completed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        userId: 1,
        type: "add_money",
        amount: "100.00",
        description: "Added money from Chase Bank ****1234",
        status: "completed",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ];

    demoTransactions.forEach(t => this.transactions.set(t.id, t));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.balance = newBalance;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(pm => pm.userId === userId);
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.currentTransactionId++,
      createdAt: new Date(),
    };
    this.transactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }
}

const storage = new MemStorage();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist/public")));

// Routes
app.get("/api/user", async (req, res) => {
  try {
    const user = await storage.getUser(1); // Demo user
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/payment-methods", async (req, res) => {
  try {
    const paymentMethods = await storage.getPaymentMethodsByUserId(1);
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await storage.getTransactionsByUserId(1);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/send-money", async (req, res) => {
  try {
    const { recipientEmail, amount, description } = req.body;
    
    if (!recipientEmail || !amount || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const sender = await storage.getUser(1);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const senderBalance = parseFloat(sender.balance);
    if (senderBalance < amountNum) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update sender balance
    const newBalance = (senderBalance - amountNum).toFixed(2);
    await storage.updateUserBalance(1, newBalance);

    // Create transaction
    const transaction = await storage.createTransaction({
      userId: 1,
      type: "send",
      amount: amount,
      description: description,
      recipientEmail: recipientEmail,
      status: "completed",
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/add-money", async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    
    if (!amount || !paymentMethodId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user balance
    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + amountNum).toFixed(2);
    await storage.updateUserBalance(1, newBalance);

    // Get payment method for description
    const paymentMethods = await storage.getPaymentMethodsByUserId(1);
    const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(paymentMethodId));
    
    let description = `Added money from payment method`;
    if (paymentMethod) {
      if (paymentMethod.type === "bank" && paymentMethod.bankName) {
        description = `Added money from ${paymentMethod.bankName} ****${paymentMethod.lastFour}`;
      } else {
        description = `Added money from ${paymentMethod.provider} ****${paymentMethod.lastFour}`;
      }
    }

    // Create transaction
    const transaction = await storage.createTransaction({
      userId: 1,
      type: "add_money",
      amount: amount,
      description: description,
      status: "completed",
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;