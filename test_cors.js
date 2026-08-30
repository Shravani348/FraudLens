const apiUrl = 'http://127.0.0.1:5000/api/analyze';

async function testApi() {
  console.log(`Testing POST request to ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify({
        text: "URGENT: Your bank account is suspended. Click here to verify KYC: http://bit.ly/fake-kyc"
      })
    });
    
    console.log("Status Code:", response.status);
    console.log("Response Headers:");
    console.log("  Access-Control-Allow-Origin:", response.headers.get("access-control-allow-origin"));
    
    const data = await response.json();
    console.log("\nResponse Body (from Gemini):");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

testApi();
