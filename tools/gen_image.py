"""Generate one image with Gemini. Usage: gen_image.py <out.png> "<prompt>" [aspect]"""
import base64, json, os, sys, urllib.request

def key():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k
    for line in open(os.path.expanduser("~/.hermes/.env")):
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip().strip("\"'")
    sys.exit("no GEMINI_API_KEY")

out, prompt = sys.argv[1], sys.argv[2]
aspect = sys.argv[3] if len(sys.argv) > 3 else "1:1"
model = os.environ.get("GEN_MODEL", "gemini-2.5-flash-image")
body = {"contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key()})
try:
    d = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read()[:300]!r}")
for p in d["candidates"][0]["content"]["parts"]:
    if "inlineData" in p:
        open(out, "wb").write(base64.b64decode(p["inlineData"]["data"]))
        print("wrote", out)
        break
else:
    sys.exit("no image: " + json.dumps(d)[:300])
