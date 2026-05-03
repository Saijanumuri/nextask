# 🎤 ElevenLabs Setup Guide

## ✅ Fixed Issues

The ElevenLabs integration has been updated with:
- ✅ Better error logging
- ✅ Correct voice ID format
- ✅ Voice selection dropdown
- ✅ Fallback to browser TTS if API fails

---

## 🚀 How to Set Up ElevenLabs

### Step 1: Get Your API Key

1. Go to https://elevenlabs.io
2. Sign up for a free account
3. Go to your profile (click your avatar)
4. Click "API Keys"
5. Copy your API key

### Step 2: Add API Key to NexTask

1. Open NexTask app
2. Go to **Stories** page
3. Click **Settings** (⚙️ icon) at top right
4. Paste your API key in the input field
5. It will save automatically

### Step 3: Select a Voice (Optional)

Once you add your API key, you'll see a voice dropdown:
- **Adam (Multilingual)** - Default, works well with Telugu
- **Sarah (Multilingual)** - Female voice
- **Brian (Multilingual)** - Male voice
- **Callum (Multilingual)** - Male voice

Choose the one you prefer!

### Step 4: Test It

1. Click the ✨ **Sparkles button** on any story
2. Enter **Cinematic Mode**
3. Check browser console (F12) for logs
4. You should see: "Generating ElevenLabs audio for..."
5. If successful: "ElevenLabs audio generated successfully"

---

## 🐛 Troubleshooting

### Issue: "ElevenLabs API error: 401"
**Cause**: Invalid API key
**Fix**: 
- Double-check your API key
- Make sure you copied it completely
- Try generating a new API key

### Issue: "ElevenLabs API error: 429"
**Cause**: Rate limit exceeded or quota exhausted
**Fix**:
- Check your ElevenLabs quota at https://elevenlabs.io
- Free tier has limited characters per month
- Wait a bit and try again
- Consider upgrading your plan

### Issue: "ElevenLabs API error: 422"
**Cause**: Invalid voice ID or text
**Fix**:
- Try a different voice from the dropdown
- Check if the story text is valid

### Issue: No sound but no errors
**Cause**: Browser autoplay policy
**Fix**:
- Click somewhere on the page first
- Check browser console for errors
- Make sure volume sliders are up

### Issue: Falls back to TTS immediately
**Cause**: API key not being sent or invalid
**Fix**:
- Open browser console (F12)
- Look for error messages
- Re-enter your API key
- Refresh the page

---

## 🔍 How to Check Console Logs

### Chrome/Edge:
1. Press **F12** or **Ctrl+Shift+I**
2. Click **Console** tab
3. Play a story in cinematic mode
4. Look for messages:
   - ✅ "Generating ElevenLabs audio for..."
   - ✅ "ElevenLabs audio generated successfully"
   - ❌ "ElevenLabs failed, falling back to TTS:"

### What You Should See:

**Success:**
```
Generating ElevenLabs audio for: ఒకప్పుడు ఒక అడవిలో...
ElevenLabs audio generated successfully
```

**Failure (with fallback):**
```
Generating ElevenLabs audio for: ఒకప్పుడు ఒక అడవిలో...
ElevenLabs API error: 401 {"detail":"Invalid API key"}
ElevenLabs failed, falling back to TTS: Error: ElevenLabs API error: 401
```

---

## 💡 Tips

### 1. Test with Short Stories First
- ElevenLabs charges per character
- Test with a short story to verify it works
- Then try longer stories

### 2. Audio Caching
- Generated audio is cached in localStorage
- Same text won't be regenerated
- Saves API calls and money!

### 3. Free Tier Limits
- ElevenLabs free tier: 10,000 characters/month
- Average story: ~500-1000 characters
- You can generate ~10-20 stories per month free

### 4. Voice Quality
- Multilingual voices work best for Telugu
- Adam voice is recommended
- Try different voices to find your favorite

### 5. Fallback Behavior
- If ElevenLabs fails, app uses browser TTS
- No interruption to user experience
- Check console to see why it failed

---

## 🎯 Quick Test

### Test if ElevenLabs is Working:

1. **Add API key** in Settings
2. **Open browser console** (F12)
3. **Click ✨** on any story
4. **Look for logs**:
   - If you see "Generating ElevenLabs audio..." → ✅ Working!
   - If you see "ElevenLabs failed..." → ❌ Check error message

---

## 📊 Voice Comparison

| Voice | Gender | Best For | Quality |
|-------|--------|----------|---------|
| Adam | Male | General stories | ⭐⭐⭐⭐⭐ |
| Sarah | Female | Bedtime stories | ⭐⭐⭐⭐⭐ |
| Brian | Male | Adventure stories | ⭐⭐⭐⭐ |
| Callum | Male | Dramatic stories | ⭐⭐⭐⭐ |

All voices support Telugu through the multilingual model!

---

## 🔧 Advanced Settings

### Custom Voice ID
If you have a custom voice in ElevenLabs:
1. Get your voice ID from ElevenLabs dashboard
2. The voice dropdown will use it automatically
3. Or modify the code to add more voices

### Adjust Voice Settings
In `cinematicAudioEngine.ts`, you can adjust:
```typescript
voice_settings: {
  stability: 0.5,        // 0-1 (lower = more expressive)
  similarity_boost: 0.75 // 0-1 (higher = more similar to original)
}
```

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] API key is correct (no extra spaces)
- [ ] API key is saved (check Settings panel)
- [ ] Browser console is open (F12)
- [ ] You clicked ✨ (not regular play button)
- [ ] You're in Cinematic Mode
- [ ] You checked console for error messages
- [ ] You have quota remaining on ElevenLabs
- [ ] Internet connection is working

---

## 🎉 Success!

If you see this in console:
```
Generating ElevenLabs audio for: ...
ElevenLabs audio generated successfully
```

**Congratulations!** 🎉 You're now using premium Telugu voice narration!

Enjoy the cinematic experience! 🎬✨

---

## 📞 Still Having Issues?

Check the browser console and look for:
1. The exact error message
2. The HTTP status code (401, 429, etc.)
3. Any network errors

Common fixes:
- **401**: Wrong API key
- **429**: Rate limit / quota exceeded
- **422**: Invalid request (try different voice)
- **Network error**: Check internet connection

The app will always fall back to browser TTS if ElevenLabs fails, so you'll never lose functionality!
