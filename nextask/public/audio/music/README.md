# Story Music Files

This directory contains background music files for Telugu stories.

## Required Music Files

Place the following MP3 files in this directory:

1. **soft-intro.mp3** - Soft intro music (3 seconds)
   - Used at the beginning of stories
   - Should be gentle and welcoming
   - Example: Soft flute or gentle piano

2. **light-transition.mp3** - Light transition music (1.5 seconds)
   - Used between story segments
   - Should be brief and smooth
   - Example: Gentle chime or soft strings

3. **soft-ending.mp3** - Soft ending music (3 seconds)
   - Used at the end of stories
   - Should provide closure
   - Example: Gentle resolution, peaceful fade

4. **fade-out.mp3** - Fade out music (2 seconds)
   - Used for final fade out
   - Should gradually decrease in volume
   - Example: Ambient fade to silence

## Music Guidelines

### Volume
- All music should be at a comfortable background level
- Will be played at 30% of user's volume setting
- Should not overpower the narration

### Duration
- Keep files short (1-3 seconds)
- Longer music will be cut off automatically
- Use fade-in/fade-out for smooth transitions

### Format
- **Format**: MP3
- **Bitrate**: 128-192 kbps (good quality, small size)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo

### Style
- **Calm and peaceful**: Suitable for storytelling
- **Cultural appropriate**: Consider Telugu/Indian musical elements
- **Non-intrusive**: Should enhance, not distract
- **Royalty-free**: Ensure you have rights to use the music

## How Music is Used

The story parser automatically detects these markers in story content:

```
🎵 [Soft intro music]      → Plays soft-intro.mp3
🎵 [light transition]      → Plays light-transition.mp3
🎵 [soft ending music]     → Plays soft-ending.mp3
🎵 [music fade out]        → Plays fade-out.mp3
```

## Finding Music

### Free Resources
- **Pixabay**: https://pixabay.com/music/
- **Free Music Archive**: https://freemusicarchive.org/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary
- **Incompetech**: https://incompetech.com/music/
- **Bensound**: https://www.bensound.com/

### Search Terms
- "soft intro music"
- "gentle transition sound"
- "peaceful ending music"
- "ambient fade out"
- "storytelling background music"
- "meditation music short"

## Creating Your Own

### Using Audacity (Free)
1. Download Audacity: https://www.audacityteam.org/
2. Create or import audio
3. Trim to desired length (1-3 seconds)
4. Add fade in/out effects
5. Export as MP3

### Using GarageBand (Mac)
1. Open GarageBand
2. Create new project
3. Add instruments or loops
4. Trim to 1-3 seconds
5. Export as MP3

### Using Online Tools
- **AudioTrimmer**: https://audiotrimmer.com/
- **MP3Cut**: https://mp3cut.net/
- **Online Audio Converter**: https://online-audio-converter.com/

## Testing

After adding music files:

1. Start the dev server: `npm run dev`
2. Go to Stories page
3. Play any story
4. Music should play at appropriate times:
   - Intro music at start
   - Transition music between segments
   - Ending music at conclusion
   - Fade out at the very end

## Fallback Behavior

If music files are not found:
- The story will still play normally
- Pauses will still work (🎧 markers)
- Text-to-Speech narration continues
- Only music is skipped

## Current Status

⚠️ **Music files not yet added**

The app will work without music files, but for the full immersive experience, please add the MP3 files listed above.

---

**Note**: Music enhances the storytelling experience but is optional. The app works perfectly fine with just Text-to-Speech narration and pauses.
