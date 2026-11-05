async function check() {
  const r = await fetch("http://localhost:3000/");
  const html = await r.text();
  console.log("Has commercial banner:", html.includes("banner_ac_commercial"));
  console.log("Has industrial banner:", html.includes("banner_ac_industrial"));
  console.log("Has tower banner:", html.includes("banner_ac_tower"));
  console.log("Has slide1:", html.includes("slide1.jpg"));
}
check();

