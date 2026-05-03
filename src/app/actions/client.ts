"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addRemark(formData: FormData) {
  const updateId = formData.get("updateId") as string;
  const remarks = formData.get("remarks") as string;

  if (!updateId || !remarks) return;

  await prisma.update.update({
    where: { id: updateId },
    data: { remarks },
  });

  revalidatePath("/dashboard");
}

export async function approvePayment(formData: FormData) {
  const paymentId = formData.get("paymentId") as string;
  const projectId = formData.get("projectId") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!paymentId || !projectId || isNaN(amount)) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "COMPLETED" },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: { fundsPooled: { increment: amount } },
    }),
  ]);

  revalidatePath("/dashboard");
}
