document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const alertBox = document.getElementById('alertBox');
  const registerBtn = document.getElementById('registerBtn');

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => alertBox.classList.remove('show'), 5000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-side validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return showAlert('Please fill in all fields.', 'error');
    }

    if (password.length < 6) {
      return showAlert('Password must be at least 6 characters.', 'error');
    }

    if (password !== confirmPassword) {
      return showAlert('Passwords do not match.', 'error');
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      return showAlert('Please enter a valid phone number (10-15 digits).', 'error');
    }

    // Disable button
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span class="spinner"></span> Creating Account...';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password })
      });

      const data = await res.json();

      if (data.success) {
        showAlert(data.message, 'success');
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } else {
        showAlert(data.message, 'error');
      }
    } catch (err) {
      showAlert('Network error. Please try again.', 'error');
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = 'Create Account';
    }
  });
});
