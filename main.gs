// ── Security helpers ───────────────────────────────────────────────────
function sanitizeName(name) {
  return String(name)
    .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s\-\.]/g, '')
    .trim()
    .substring(0, 50);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Main entry point ───────────────────────────────────────────────────
function doGet(e) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 20px;
        background: #f0f4f8;
        transition: background 0.4s ease;
      }
      .card {
        background: white;
        border-radius: 24px;
        padding: 52px 28px 40px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        text-align: center;
        width: 100%;
        max-width: 480px;
      }
      .icon  { font-size: 88px; margin-bottom: 20px; line-height: 1; }
      h1     { font-size: 28px; color: #1a1a1a; margin-bottom: 10px; font-weight: 700; }
      .sub   { color: #888; font-size: 16px; margin-bottom: 32px; line-height: 1.5; }
      input {
        width: 100%;
        padding: 18px 16px;
        font-size: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 14px;
        outline: none;
        margin-bottom: 16px;
        text-align: center;
        -webkit-appearance: none;
        display: block;
      }
      input:focus { border-color: #6366f1; }
      .btn {
        width: 100%;
        padding: 18px;
        background: #6366f1;
        color: white;
        font-size: 20px;
        font-weight: 700;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        display: block;
      }
      .btn:active  { background: #4f46e5; transform: scale(0.98); }
      .btn:disabled { background: #a5b4fc; cursor: not-allowed; }
      .badge {
        display: inline-block;
        color: white;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 2px;
        padding: 6px 20px;
        border-radius: 99px;
        margin-bottom: 24px;
      }
      .greet { font-size: 22px; color: #888; margin-bottom: 4px; }
      .name  { font-size: 36px; font-weight: 800; color: #1a1a1a; margin-bottom: 24px; }
      .stamp {
        background: #f8fafc;
        border-radius: 14px;
        padding: 16px;
        width: 100%;
        margin-bottom: 8px;
      }
      .stamp .time { font-size: 32px; font-weight: 700; color: #1a1a1a; }
      .stamp .date { font-size: 16px; color: #888; margin-top: 4px; }
      .reset  { margin-top: 28px; font-size: 13px; color: #ccc; }
      .reset a { color: #ccc; text-decoration: underline; cursor: pointer; }
      .loading { font-size: 18px; color: #888; margin-top: 16px; line-height: 1.6; }
      .error  { font-size: 18px; color: #ef4444; margin-top: 16px; line-height: 1.6; }
      #screen-setup, #screen-loading, #screen-confirm, #screen-error { display: none; }
    </style>
  </head>
  <body>

    <!-- SCREEN 1: First time name entry -->
    <div class="card" id="screen-setup">
      <div class="icon">👋</div>
      <h1>First Time Setup</h1>
      <p class="sub">Enter your name once —<br>your phone will remember it forever.</p>
      <input type="text" id="nameInput" placeholder="Your name..."
             autocomplete="off" autocapitalize="words"
             maxlength="50" />
      <button class="btn" id="saveBtn" onclick="submitName()">
        Save &amp; Clock In / Out
      </button>
    </div>

    <!-- SCREEN 2: Loading -->
    <div class="card" id="screen-loading">
      <div class="icon">⏳</div>
      <p class="loading">Recording your time...<br>Please wait.</p>
    </div>

    <!-- SCREEN 3: Confirmation -->
    <div class="card" id="screen-confirm">
      <div class="icon"  id="conf-icon"></div>
      <div class="badge" id="conf-badge"></div>
      <p class="greet"   id="conf-greet"></p>
      <p class="name"    id="conf-name"></p>
      <div class="stamp">
        <div class="time" id="conf-time"></div>
        <div class="date" id="conf-date"></div>
      </div>
      <p class="reset"><a onclick="resetName()">Not you? Reset name</a></p>
    </div>

    <!-- SCREEN 4: Error -->
    <div class="card" id="screen-error">
      <div class="icon">❌</div>
      <h1>Access Denied</h1>
      <p class="error" id="error-msg">This name is not registered.<br>Please contact your manager.</p>
      <button class="btn" style="margin-top:24px; background:#64748b;" onclick="resetName()">
        Try Again
      </button>
    </div>

    <script>
      function showScreen(id) {
        ['screen-setup','screen-loading','screen-confirm','screen-error'].forEach(function(s) {
          document.getElementById(s).style.display = 'none';
        });
        document.getElementById(id).style.display = 'block';
      }

      // ── Sanitize name client-side before even sending ─────────────
      function sanitizeInput(name) {
        return name.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\\s\\-\\.]/g, '').trim().substring(0, 50);
      }

      function submitName() {
        var raw  = document.getElementById('nameInput').value;
        var name = sanitizeInput(raw);
        if (!name) {
          alert('Please enter a valid name (letters only).');
          return;
        }
        localStorage.setItem('employee_name', name);
        clockInOut(name);
      }

      function clockInOut(name) {
        showScreen('screen-loading');
        google.script.run
          .withSuccessHandler(function(result) {
            if (result.error) {
              document.getElementById('error-msg').innerText = result.error;
              document.body.style.background = '#f0f4f8';
              showScreen('screen-error');
            } else {
              showConfirmation(result);
            }
          })
          .withFailureHandler(function(err) {
            document.getElementById('error-msg').innerText =
              'Something went wrong. Please try again.';
            showScreen('screen-error');
          })
          .recordAttendance(name);
      }

      function showConfirmation(result) {
        var isIn = result.action === 'IN';
        document.body.style.background = isIn ? '#f0fdf4' : '#fff5f5';
        document.getElementById('conf-icon').innerText  = isIn ? '✅' : '🚪';
        document.getElementById('conf-badge').innerText = isIn ? 'CLOCKED IN' : 'CLOCKED OUT';
        document.getElementById('conf-badge').style.background = isIn ? '#22c55e' : '#ef4444';
        document.getElementById('conf-greet').innerText = isIn ? 'Welcome,' : 'See you,';
        document.getElementById('conf-name').innerText  = result.employee;  // innerText is XSS safe
        document.getElementById('conf-time').innerText  = result.time;
        document.getElementById('conf-date').innerText  = result.date;
        showScreen('screen-confirm');
      }

      function resetName() {
        localStorage.removeItem('employee_name');
        document.getElementById('nameInput').value = '';
        document.body.style.background = '#f0f4f8';
        showScreen('screen-setup');
      }

      // ── On load: check localStorage ──────────────────────────────
      window.onload = function() {
        var saved = localStorage.getItem('employee_name');
        if (saved && saved.trim() !== '') {
          clockInOut(saved.trim());
        } else {
          showScreen('screen-setup');
        }
      };

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') submitName();
      });
    </script>
  </body>
</html>`;

  return HtmlService.createHtmlOutput(html).setTitle('Clock In / Out');
}

// ── Called by google.script.run from the browser ──────────────────────
function recordAttendance(employee) {

  // ── LAYER 1: Sanitize input ────────────────────────────────────────
  employee = sanitizeName(employee);
  if (!employee) {
    return { error: 'Invalid name. Only letters are allowed.' };
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const now   = new Date();
  const tz    = Session.getScriptTimeZone();
  const today = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  const time  = Utilities.formatDate(now, tz, "HH:mm:ss");

  // ── For loop search — backwards for speed ─────────────────────────
  const lastRow = sheet.getLastRow();
  let lastAction = null;

  for (let i = lastRow; i >= 2; i--) {
    const rowName   = sheet.getRange(i, 1).getDisplayValue().trim().toLowerCase();
    const rowAction = sheet.getRange(i, 2).getDisplayValue().trim().toUpperCase();
    const rowDate   = sheet.getRange(i, 3).getDisplayValue().trim();

    if (rowName === employee.toLowerCase() && rowDate === today) {
      lastAction = rowAction; // first match going backwards = last action today
      break;
    }
  }

  // ── Toggle IN / OUT ────────────────────────────────────────────────
  const action = (lastAction === null || lastAction === "OUT") ? "IN" : "OUT";

  // ── Append row ─────────────────────────────────────────────────────
  sheet.appendRow([employee, action, today, time]);

  // ── Return safe escaped result ─────────────────────────────────────
  return {
    employee : escapeHtml(employee),
    action   : action,
    time     : time,
    date     : today
  };
}