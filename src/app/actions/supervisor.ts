"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

export async function uploadProgressUpdate(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const description = formData.get("description") as string;
  const stage = formData.get("stage") as string || "General";
  const manpowerMestri = parseInt(formData.get("manpowerMestri") as string, 10) || 0;
  const manpowerHelper = parseInt(formData.get("manpowerHelper") as string, 10) || 0;
  const progress = parseInt(formData.get("progress") as string, 10) || 0;
  const image = formData.get("image") as File;

  if (!projectId || !stage) {
    throw new Error("Project and Stage are required");
  }

  let imageUrl = null;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  await prisma.update.create({
    data: {
      description: description || "Daily update logged.",
      imageUrl,
      projectId,
      stage,
      manpowerMestri,
      manpowerHelper,
      progress,
    },
  });

  revalidatePath("/supervisor");
}

export async function updateProjectProgress(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const progress = parseInt(formData.get("progress") as string, 10);

  if (!projectId || isNaN(progress) || progress < 0 || progress > 100) {
    throw new Error("Valid project ID and progress percentage (0-100) are required");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });

  revalidatePath("/supervisor");
}

export async function toggleChecklistItem(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const stageId = formData.get("stageId") as string;
  const item = formData.get("item") as string;

  if (!projectId || !stageId || !item) return;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { checklist: true },
  });

  if (!project) return;

  let checklistData: Record<string, Record<string, boolean>> = {};
  if (project.checklist) {
    try {
      checklistData = JSON.parse(project.checklist);
    } catch (e) {
      // Ignored
    }
  }

  if (!checklistData[stageId]) {
    checklistData[stageId] = {};
  }

  // Toggle state
  checklistData[stageId][item] = !checklistData[stageId][item];

  await prisma.project.update({
    where: { id: projectId },
    data: { checklist: JSON.stringify(checklistData) },
  });

  revalidatePath("/supervisor");
}
