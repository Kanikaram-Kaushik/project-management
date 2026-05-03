"use client";

import { useState } from "react";
import { PROJECT_STAGES } from "@/lib/constants";
import { uploadProgressUpdate, toggleChecklistItem, updateProjectProgress } from "@/app/actions/supervisor";
import { addRemark } from "@/app/actions/client";

export default function ProjectTracker({ project, isSupervisor }: { project: any, isSupervisor: boolean }) {
  const [activeTab, setActiveTab] = useState(PROJECT_STAGES[0].id);

  const activeStage = PROJECT_STAGES.find(s => s.id === activeTab);
  const updatesForStage = project.updates.filter((u: any) => u.stage === activeTab);

  let checklistData: Record<string, Record<string, boolean>> = {};
  if (project.checklist) {
    try {
      checklistData = JSON.parse(project.checklist);
    } catch (e) {}
  }
  const stageChecklist = checklistData[activeTab] || {};

  return (
    <div className="card" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>{project.title}</h4>
        {isSupervisor && (
          <form action={updateProjectProgress} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="hidden" name="projectId" value={project.id} />
            <label style={{ fontSize: '0.8rem' }}>Overall %</label>
            <input type="number" name="progress" min="0" max="100" defaultValue={project.progress} className="input-field" style={{ width: '70px', padding: '0.25rem' }} />
            <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Save</button>
          </form>
        )}
      </div>
      <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
        {isSupervisor ? `Client: ${project.client.name}` : `Supervisor: ${project.supervisor?.name || "Unassigned"}`}
      </p>

      {!isSupervisor && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <h5 style={{ margin: 0, marginBottom: '0.5rem' }}>Overall Progress: {project.progress}%</h5>
          <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${project.progress}%`, background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {PROJECT_STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActiveTab(stage.id)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === stage.id ? 'var(--accent)' : 'transparent',
              color: activeTab === stage.id ? 'black' : 'var(--foreground)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              fontWeight: activeTab === stage.id ? 'bold' : 'normal',
            }}
          >
            {stage.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column: Checklist */}
        <div>
          <h5 style={{ marginBottom: '1rem' }}>{activeStage?.label} Checklist</h5>
          {activeStage?.checklist.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>No checklist items for this stage.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeStage?.checklist.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isSupervisor ? (
                    <form action={toggleChecklistItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="stageId" value={activeTab} />
                      <input type="hidden" name="item" value={item} />
                      <input type="checkbox" onChange={(e) => e.target.form?.requestSubmit()} checked={!!stageChecklist[item]} />
                      <span style={{ fontSize: '0.85rem', textDecoration: stageChecklist[item] ? 'line-through' : 'none', color: stageChecklist[item] ? 'var(--muted)' : 'var(--foreground)' }}>{item}</span>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" readOnly checked={!!stageChecklist[item]} disabled />
                      <span style={{ fontSize: '0.85rem', textDecoration: stageChecklist[item] ? 'line-through' : 'none', color: stageChecklist[item] ? 'var(--muted)' : 'var(--foreground)' }}>{item}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Daily Reports */}
        <div>
          <h5 style={{ marginBottom: '1rem' }}>Daily Reports ({activeStage?.label})</h5>
          
          {isSupervisor && (
            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h6 style={{ margin: 0, marginBottom: '1rem' }}>Post New Report</h6>
              <form action={uploadProgressUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="stage" value={activeTab} />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Mestri (Count)</label>
                    <input type="number" name="manpowerMestri" defaultValue={0} min="0" className="input-field" style={{ padding: '0.5rem' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Helper (Count)</label>
                    <input type="number" name="manpowerHelper" defaultValue={0} min="0" className="input-field" style={{ padding: '0.5rem' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Stage Progress %</label>
                    <input type="number" name="progress" defaultValue={0} min="0" max="100" className="input-field" style={{ padding: '0.5rem' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Images / Video</label>
                  <input type="file" name="image" accept="image/*,video/*" className="input-field" style={{ padding: '0.5rem' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Comments</label>
                  <textarea name="description" className="input-field" rows={2} placeholder="Describe the day's work..."></textarea>
                </div>
                
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save Report</button>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {updatesForStage.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>No daily reports logged for this stage yet.</p>
            ) : (
              updatesForStage.map((update: any) => (
                <div key={update.id} style={{ background: 'var(--background)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{new Date(update.createdAt).toLocaleDateString()}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Stage Progress: {update.progress}%</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <span><strong>Mestri:</strong> {update.manpowerMestri}</span>
                    <span><strong>Helpers:</strong> {update.manpowerHelper}</span>
                  </div>

                  {update.description && (
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>{update.description}</p>
                  )}

                  {update.imageUrl && (
                    <img src={update.imageUrl} alt="Progress" style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '0.5rem', maxHeight: '300px', objectFit: 'cover' }} />
                  )}

                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                    {update.remarks ? (
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>Client Remark:</strong>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{update.remarks}</p>
                      </div>
                    ) : (
                      !isSupervisor && (
                        <form action={addRemark} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="hidden" name="updateId" value={update.id} />
                          <input type="text" name="remarks" className="input-field" placeholder="Add a remark..." required style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }} />
                          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Submit</button>
                        </form>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
