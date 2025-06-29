import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'card' | 'bank'
  provider: text("provider").notNull(), // 'visa', 'mastercard', 'bank'
  lastFour: text("last_four").notNull(),
  expiryDate: text("expiry_date"),
  bankName: text("bank_name"),
  isPrimary: boolean("is_primary").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'send', 'receive', 'purchase', 'add_money'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  recipientName: text("recipient_name"),
  recipientEmail: text("recipient_email"),
  merchantName: text("merchant_name"),
  orderId: text("order_id"),
  status: text("status").notNull().default("completed"), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const sendMoneySchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  amount: z.string().min(1, "Amount is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be greater than 0"),
  note: z.string().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SendMoney = z.infer<typeof sendMoneySchema>;
