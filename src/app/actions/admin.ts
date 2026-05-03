"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveUserRole(formData: FormData) {
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (!userId || !role) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin");
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const clientId = formData.get("clientId") as string;
  const supervisorId = formData.get("supervisorId") as string;
  const totalBudget = parseFloat(formData.get("totalBudget") as string) || 0;

  if (!title || !clientId) {
    throw new Error("Title and Client are required.");
  }

  await prisma.project.create({
    data: {
      title,
      description,
      clientId,
      supervisorId: supervisorId || null,
      totalBudget,
    },
  });

  revalidatePath("/admin");
}
