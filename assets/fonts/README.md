# Font Installation Instructions

## Missing Font: Powerless.ttf

The app is configured to use the **Powerless** font, but the font file is not currently installed.

### How to Add the Font:

1. **Download Powerless Font:**
   - Search for "Powerless font free download" online
   - Or visit: https://www.dafont.com/powerless.font
   - Or use https://www.fontspace.com/powerless-font

2. **Add to Project:**
   - Download `Powerless.ttf` (or `Powerless.otf`)
   - Copy it to this directory: `assets/fonts/`
   - File should be named exactly: `Powerless.ttf`

3. **Link the Font:**
   ```bash
   npx react-native-asset
   ```

4. **Rebuild the App:**
   ```bash
   npm run android
   ```

### Alternative: Use a Different Font

If you can't find Powerless, you can use a similar bold game font:
- **Bebas Neue** (free, similar bold style)
- **Audiowide** (futuristic, game-like)
- **Orbitron** (sci-fi style)

Just replace "Powerless" with the font name in `src/styles/theme.ts`

### Verify Font Installation:

After linking, check these directories:
- Android: `android/app/src/main/assets/fonts/Powerless.ttf`
- iOS: `ios/WOSGuides/Fonts/Powerless.ttf`

If the font files appear there, the linking was successful!
