"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return { error: "Invalid credentials" };
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Return redirect URL to be handled by client
  if (user.role === "ADMIN") {
    return { redirectTo: "/admin" };
  } else if (user.role === "SUPERVISOR") {
    return { redirectTo: "/supervisor" };
  } else if (user.role === "USER") {
    return { redirectTo: "/dashboard" };
  } else {
    return { error: "Your account is pending approval by an admin." };
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: "PENDING",
    },
  });

  return { success: "Account created successfully! Please wait for admin approval before logging in." };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
  });
}
