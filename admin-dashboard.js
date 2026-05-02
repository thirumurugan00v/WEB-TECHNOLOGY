document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('complaintsTableBody');
  const emptyState = document.getElementById('emptyState');
  const tableWrapper = document.getElementById('tableWrapper');
  const totalCount = document.getElementById('totalCount');
  const pendingCount = document.getElementById('pendingCount');
  const progressCount = document.getElementById('progressCount');
  const resolvedCount = document.getElementById('resolvedCount');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  // Check admin auth
  async function checkAdminAuth() {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (!data.success) {
        window.location.href = '/admin-login.html';
      }
    } catch {
      window.location.href = '/admin-login.html';
    }
  }

  // Load all complaints
  async function loadComplaints() {
    try {
      const res = await fetch('/api/admin/complaints');
      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) return window.location.href = '/admin-login.html';
        return;
      }

      const complaints = data.complaints;

      // Update stats
      totalCount.textContent = complaints.length;
      pendingCount.textContent = complaints.filter(c => c.status === 'Pending').length;
      progressCount.textContent = complaints.filter(c => c.status === 'In Progress').length;
      resolvedCount.textContent = complaints.filter(c => c.status === 'Resolved').length;

      if (complaints.length === 0) {
        tableWrapper.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      tableWrapper.style.display = 'block';
      emptyState.style.display = 'none';

      tableBody.innerHTML = complaints.map((c, i) => {
        const date = new Date(c.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });

        const userName = c.user ? c.user.fullName : 'Unknown';
        const userEmail = c.user ? c.user.email : '';

        const badgeClass = c.status === 'Pending' ? 'badge-pending'
          : c.status === 'In Progress' ? 'badge-progress'
          : 'badge-resolved';

        return `
          <tr>
            <td>${i + 1}</td>
            <td>
              <div class="user-info">
                <span class="user-name">${escapeHtml(userName)}</span>
                <span class="user-email">${escapeHtml(userEmail)}</span>
              </div>
            </td>
            <td>${escapeHtml(c.category)}</td>
            <td title="${escapeHtml(c.description)}">${escapeHtml(c.subject)}</td>
            <td>${date}</td>
            <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${c.status}</span></td>
            <td>
              <select class="status-select" data-id="${c._id}" onchange="updateStatus(this)">
                <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');

    } catch (err) {
      console.error('Failed to load complaints:', err);
    }
  }

  // Update complaint status
  window.updateStatus = async function(selectEl) {
    const id = selectEl.dataset.id;
    const status = selectEl.value;

    try {
      const res = await fetch(`/api/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (data.success) {
        // Refresh the table to update badge colors
        loadComplaints();
      } else {
        alert('Failed to update status: ' + data.message);
        loadComplaints(); // Revert
      }
    } catch (err) {
      alert('Network error. Please try again.');
      loadComplaints();
    }
  };

  // Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } catch {}
      window.location.href = '/admin-login.html';
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  checkAdminAuth();
  loadComplaints();
});
