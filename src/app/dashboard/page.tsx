import { prisma } from "@/lib/prisma";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ProjectTracker from "@/components/ProjectTracker";

export default async function ClientDashboard() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "USER") {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { clientId: currentUser.id },
    include: {
      supervisor: true,
      updates: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <main style={{ padding: '2rem' }}>
      <div className="card fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Client Portal</h2>
          <form action={logoutUser}>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Logout</button>
          </form>
        </div>
        <p className="text-muted">Welcome to your Luxe Interior Hub, {currentUser.name}. Track your project's progress and manage financials.</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.length === 0 ? (
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)' }}>
              <h3>Project Status</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Awaiting interior project initiation. An admin will assign your project soon.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (projects as any[]).map((project: any) => (
              <ProjectTracker key={project.id} project={project} isSupervisor={false} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
