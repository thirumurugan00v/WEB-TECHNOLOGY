document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('complaintForm');
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');
  const descriptionField = document.getElementById('description');
  const charCount = document.getElementById('charCount');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check auth
  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.success) {
        window.location.href = '/login.html';
      }
    } catch {
      window.location.href = '/login.html';
    }
  }

  // Character counter
  if (descriptionField && charCount) {
    descriptionField.addEventListener('input', () => {
      charCount.textContent = descriptionField.value.length;
    });
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => alertBox.classList.remove('show'), 5000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const subject = document.getElementById('subject').value.trim();
    const description = descriptionField.value.trim();

    if (!category || !subject || !description) {
      return showAlert('Please fill in all fields.', 'error');
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject, description })
      });

      const data = await res.json();

      if (data.success) {
        showAlert('Complaint submitted successfully! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);
      } else {
        showAlert(data.message, 'error');
      }
    } catch (err) {
      showAlert('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Complaint';
    }
  });

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

  checkAuth();
});
