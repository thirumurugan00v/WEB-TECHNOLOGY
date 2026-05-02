document.addEventListener('DOMContentLoaded', () => {
  const welcomeText = document.getElementById('welcomeText');
  const complaintsGrid = document.getElementById('complaintsGrid');
  const totalCount = document.getElementById('totalCount');
  const pendingCount = document.getElementById('pendingCount');
  const progressCount = document.getElementById('progressCount');
  const resolvedCount = document.getElementById('resolvedCount');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check auth and get user info
  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.success) {
        window.location.href = '/login.html';
        return;
      }
      welcomeText.textContent = `Welcome back, ${data.user.fullName}!`;
    } catch {
      window.location.href = '/login.html';
    }
  }

  // Load complaints
  async function loadComplaints() {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) return window.location.href = '/login.html';
        return;
      }

      const complaints = data.complaints;

      // Update stats
      totalCount.textContent = complaints.length;
      pendingCount.textContent = complaints.filter(c => c.status === 'Pending').length;
      progressCount.textContent = complaints.filter(c => c.status === 'In Progress').length;
      resolvedCount.textContent = complaints.filter(c => c.status === 'Resolved').length;

      // Render complaints
      if (complaints.length === 0) {
        complaintsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No Complaints Yet</h3>
            <p>You haven't raised any complaints. Click the button above to get started.</p>
            <a href="/raise-complaint.html" class="btn btn-primary">+ Raise Complaint</a>
          </div>
        `;
        return;
      }

      complaintsGrid.innerHTML = complaints.map((c, i) => {
        const badgeClass = c.status === 'Pending' ? 'badge-pending'
          : c.status === 'In Progress' ? 'badge-progress'
          : 'badge-resolved';

        const date = new Date(c.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });

        const categoryIcons = {
          'Infrastructure': '🏗️',
          'Academic': '🎓',
          'Hostel': '🏠',
          'Transport': '🚌',
          'Other': '📌'
        };

        return `
          <div class="complaint-card" style="animation-delay:${i * 0.08}s;">
            <div class="card-top">
              <span class="card-category">${categoryIcons[c.category] || '📌'} ${c.category}</span>
              <span class="badge ${badgeClass}"><span class="badge-dot"></span>${c.status}</span>
            </div>
            <h3>${escapeHtml(c.subject)}</h3>
            <p class="card-desc">${escapeHtml(c.description)}</p>
            <div class="card-footer">
              <span class="card-date">📅 ${date}</span>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error('Failed to load complaints:', err);
    }
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {}
      window.location.href = '/login.html';
    });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  checkAuth();
  loadComplaints();
});
