import { prisma } from "@/lib/prisma";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { approveUserRole, createProject } from "@/app/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/login");
  }

  const pendingUsers = await prisma.user.findMany({
    where: { role: "PENDING" },
  });

  const allClients = await prisma.user.findMany({
    where: { role: "USER" },
  });

  const allSupervisors = await prisma.user.findMany({
    where: { role: "SUPERVISOR" },
  });

  const projects = await prisma.project.findMany({
    include: {
      client: true,
      supervisor: true,
    },
  });

  return (
    <main style={{ padding: '2rem' }}>
      <div className="card fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Admin Dashboard</h2>
          <form action={logoutUser}>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Logout</button>
          </form>
        </div>
        <p className="text-muted">Welcome, {currentUser.name}. Here you can manage projects, users, and financials.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Pending Approvals ({pendingUsers.length})</h3>
          {pendingUsers.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No pending accounts.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {pendingUsers.map(user => (
                <div key={user.id} className="card" style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{user.name}</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>{user.email}</p>
                  </div>
                  <form action={approveUserRole} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="hidden" name="userId" value={user.id} />
                    <select name="role" className="input-field" style={{ padding: '0.25rem 0.5rem', width: 'auto' }}>
                      <option value="USER">Client</option>
                      <option value="SUPERVISOR">Supervisor</option>
                    </select>
                    <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Approve</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Create Project</h3>
          <form action={createProject} className="card" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Project Title</label>
              <input name="title" type="text" className="input-field" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
              <textarea name="description" className="input-field" rows={3}></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Assign Client</label>
                <select name="clientId" className="input-field" required>
                  <option value="">-- Select Client --</option>
                  {allClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Assign Supervisor (Optional)</label>
                <select name="supervisorId" className="input-field">
                  <option value="">-- None --</option>
                  {allSupervisors.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Create Project</button>
          </form>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Active Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No projects created yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {projects.map(p => (
                <div key={p.id} className="card" style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)' }}>
                  <h4>{p.title}</h4>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>{p.description}</p>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Client:</strong> {p.client.name} <br/>
                    <strong>Supervisor:</strong> {p.supervisor?.name || 'Unassigned'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
