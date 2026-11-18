fetch('https://ogheavyduty.in/')
  .then(r => r.text())
  .then(html => {
    let idx = 0;
    while ((idx = html.indexOf('uploads/logo', idx)) !== -1) {
      console.log('--- FOUND AT', idx, '---');
      console.log(html.slice(Math.max(0, idx - 150), idx + 250));
      idx += 12;
    }
  })
  .catch(console.error);
