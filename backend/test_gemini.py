import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:5]}...{api_key[-5:]}" if api_key else "API Key not found")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Hello, this is a test. Please respond with exactly 'API_IS_WORKING'.")
    print("\nSUCCESS! Gemini API Response:")
    print(response.text)
except Exception as e:
    print(f"\nERROR calling Gemini API: {e}")
