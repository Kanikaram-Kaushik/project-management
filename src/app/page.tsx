import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Navigation (Transparent) */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
          LUXE
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/login" passHref>
            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>Client / Staff Login</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <div style={{ flex: 1, padding: '8rem 4rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
          <div className="fade-in">
            <h1 style={{ fontSize: '4.5rem', fontWeight: 400, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Elevating the <br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Interior Design</span> <br />
              Experience.
            </h1>
            <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
              A premium project management suite tailored exclusively for high-end interior spaces. Seamlessly track progress, view supervisor updates, and manage project funds.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/login" passHref>
                <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Access Your Project</button>
              </Link>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Image 
             src="/hero-livingroom.png" 
             alt="Luxurious Living Room" 
             fill
             priority
             style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 10s ease' }}
             className="hero-image-zoom"
          />
          {/* Subtle gradient overlay to blend edge */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '150px', background: 'linear-gradient(to right, var(--background), transparent)' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 4rem', backgroundColor: 'rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <Image 
             src="/moodboard.png" 
             alt="Design Moodboard" 
             fill
             style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Real-Time Insights <br/> & Supervision.</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Our supervisors document every step of the journey, ensuring clients have complete transparency over their investments. View high-resolution imagery of the ongoing work directly from your dashboard.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>✓</div>
               <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Live Progress Tracking</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>✓</div>
               <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Direct Fund Pooling</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>✓</div>
               <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Supervisor Verifications</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Gallery / CTA Section */}
      <section style={{ padding: '8rem 4rem', backgroundColor: 'var(--background)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>The Standard of Excellence.</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
          Experience the pinnacle of interior design collaboration. Let your space reflect your standards.
        </p>
        
        <div style={{ position: 'relative', height: '500px', width: '100%', maxWidth: '1200px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
           <Image 
             src="/kitchen.png" 
             alt="Sophisticated Kitchen" 
             fill
             style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem', backgroundColor: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em' }}>
          LUXE
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
          © 2026 Luxe Interior Management. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
