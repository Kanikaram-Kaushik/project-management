import { prisma } from "@/lib/prisma";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ProjectTracker from "@/components/ProjectTracker";

export default async function SupervisorDashboard() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "SUPERVISOR") {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { supervisorId: currentUser.id },
    include: {
      client: true,
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
          <h2>Supervisor Dashboard</h2>
          <form action={logoutUser}>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Logout</button>
          </form>
        </div>
        <p className="text-muted">Welcome, {currentUser.name}. Here you can track your assigned interior design projects and post updates.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Your Assigned Projects ({projects.length})</h3>
          
          {projects.length === 0 ? (
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', marginTop: '1rem' }}>
              <h4>No projects assigned yet</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>When an admin assigns a project to you, it will appear here for progress updates and image uploads.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
              {projects.map(project => (
                <ProjectTracker key={project.id} project={project} isSupervisor={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
