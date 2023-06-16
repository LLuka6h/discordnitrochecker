const fileInput = document.getElementById('fileInput');
const codeInput = document.getElementById('codeInput');
const checkBtn = document.getElementById('checkBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const clearCodesBtn = document.getElementById('clearCodesBtn');
const logContainer = document.getElementById('log');
let shouldStop = false;

checkBtn.addEventListener('click', async () => {
  shouldStop = false;
  checkBtn.disabled = true;
  clearLogBtn.disabled = true;
  clearCodesBtn.disabled = true;
  logContainer.innerHTML = '';

  let codesArray = [];
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileContent = await readFile(file);
    codesArray = fileContent.split('\n');
  } else {
    codesArray = codeInput.value.split('\n');
  }

  if (codesArray.length > 0) {
    for (const code of codesArray) {
      if (shouldStop) {
        break;
      }
      await checkNitroCode(code);
    }

    logContainer.innerHTML += 'Nitro code checking completed!';
  } else {
    logContainer.innerHTML = 'No codes found.';
  }

  checkBtn.disabled = false;
  clearLogBtn.disabled = false;
  clearCodesBtn.disabled = false;
});

clearLogBtn.addEventListener('click', () => {
  logContainer.innerHTML = '';
});

clearCodesBtn.addEventListener('click', () => {
  codeInput.value = '';
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkNitroCode(code) {
  try {
    const response = await fetch(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}`);
    if (response.ok) {
      const data = await response.json();
      if (data.uses < data.max_uses && !data.expires_at) {
        appendLog(`Valid code found: ${code}`, 'valid');
      } else {
        appendLog(`Invalid code: ${code}`, 'invalid');
      }
    } else {
      appendLog(`Invalid code: ${code}`, 'invalid');
    }
  } catch (error) {
    appendLog(`Invalid code: ${code}`, 'invalid');
  }
}

function appendLog(message, className) {
  const logItem = document.createElement('div');
  logItem.classList.add('log-item');
  logItem.classList.add(className);
  logItem.textContent = message;
  logContainer.appendChild(logItem);
  logContainer.scrollTop = logContainer.scrollHeight;
}
