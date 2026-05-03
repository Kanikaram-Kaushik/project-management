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
