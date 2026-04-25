const fs = require('fs');
const path = require('path');

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatBuildLabel(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = pad2(date.getDate());
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `Build ${day} ${month} ${year}, ${hours}.${minutes}`;
}

const now = new Date();
const buildInfo = {
  label: formatBuildLabel(now),
  iso: now.toISOString()
};

const outPath = path.join(__dirname, '..', 'build-info.json');
fs.writeFileSync(outPath, JSON.stringify(buildInfo, null, 2) + '\n', 'utf8');
console.log(`Wrote ${outPath}: ${buildInfo.label}`);
