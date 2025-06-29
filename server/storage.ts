import { users, paymentMethods, transactions, type User, type InsertUser, type PaymentMethod, type InsertPaymentMethod, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;

  // Payment method methods
  getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;

  // Transaction methods
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private paymentMethods: Map<number, PaymentMethod>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentPaymentMethodId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.paymentMethods = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentPaymentMethodId = 1;
    this.currentTransactionId = 1;

    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "johnsmith",
      email: "john.smith@email.com",
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      balance: "1284.50",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);
    this.currentUserId = 2;

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
        bankName: "Bank of America",
        isPrimary: false,
        isActive: true,
      },
    ];

    demoPaymentMethods.forEach(method => {
      this.paymentMethods.set(method.id, method);
    });
    this.currentPaymentMethodId = 4;

    // Create demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: 1,
        userId: 1,
        type: "receive",
        amount: "125.00",
        description: "Payment Received",
        recipientName: "Sarah Johnson",
        recipientEmail: null,
        merchantName: null,
        orderId: null,
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 2,
        userId: 1,
        type: "send",
        amount: "42.50",
        description: "Dinner split",
        recipientName: "Mike Wilson",
        recipientEmail: null,
        merchantName: null,
        orderId: null,
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: 3,
        userId: 1,
        type: "purchase",
        amount: "89.99",
        description: "Amazon Purchase",
        recipientName: null,
        recipientEmail: null,
        merchantName: "Amazon",
        orderId: "AMZ-789456",
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        id: 4,
        userId: 1,
        type: "add_money",
        amount: "500.00",
        description: "Added Money",
        recipientName: null,
        recipientEmail: null,
        merchantName: null,
        orderId: null,
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
    ];

    demoTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
    this.currentTransactionId = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      avatar: insertUser.avatar || null,
      balance: insertUser.balance || "0.00",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, balance: newBalance };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(
      method => method.userId === userId && method.isActive
    );
  }

  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = this.currentPaymentMethodId++;
    const paymentMethod: PaymentMethod = {
      ...insertPaymentMethod,
      id,
      expiryDate: insertPaymentMethod.expiryDate || null,
      bankName: insertPaymentMethod.bankName || null,
      isPrimary: insertPaymentMethod.isPrimary || false,
      isActive: insertPaymentMethod.isActive || true,
    };
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: insertTransaction.status || "completed",
      recipientName: insertTransaction.recipientName || null,
      recipientEmail: insertTransaction.recipientEmail || null,
      merchantName: insertTransaction.merchantName || null,
      orderId: insertTransaction.orderId || null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
