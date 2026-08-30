async function test() {
  const response = await fetch("http://127.0.0.1:5000/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: "TESTMARKER123_ROUND2 test message"
    })
  });
  console.log("Status:", response.status);
  const data = await response.json();
  console.log("Response:", data.source);
}
test();
