document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const alertBox = document.getElementById('alertBox');
  const adminLoginBtn = document.getElementById('adminLoginBtn');

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => alertBox.classList.remove('show'), 5000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      return showAlert('Please fill in all fields.', 'error');
    }

    adminLoginBtn.disabled = true;
    adminLoginBtn.innerHTML = '<span class="spinner"></span> Logging in...';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/admin-dashboard.html';
        }, 1000);
      } else {
        showAlert(data.message, 'error');
      }
    } catch (err) {
      showAlert('Network error. Please try again.', 'error');
    } finally {
      adminLoginBtn.disabled = false;
      adminLoginBtn.textContent = 'Admin Login';
    }
  });
});
