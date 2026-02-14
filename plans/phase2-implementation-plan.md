# Gaileen Cipher Web UI - Phase 2 Implementation Plan

**Version**: 1.2  
**Date**: February 10, 2026  
**Last Updated**: February 10, 2026 - Phase 2B Complete  
**Target**: Enhanced UI with Cipher Wheel, Copy Functionality, and Dark Mode

---

## ⚠️ IMPORTANT: Plan Maintenance

**This implementation plan MUST be updated whenever a phase or series of tasks is completed.**

When completing work:
1. Mark completed tasks with `[x]` in the checkboxes
2. Update the "Last Updated" date in the header
3. Add notes about any deviations from the plan
4. Document any issues encountered and their solutions
5. Update the "Current Status" section below

---

## Current Status

**Phase 2A**: ✅ **COMPLETE** (February 10, 2026)
- Copy to clipboard functionality fully implemented and tested
- All tests passing (41/41)
- See `PHASE2A-COMPLETE.md` for detailed completion report

**Phase 2B**: ✅ **COMPLETE** (February 10, 2026)
- Dark mode fully implemented with theme persistence and system preference detection
- 25 new tests added (11 for ThemeContext, 14 for ThemeToggle)
- All tests passing (66/66)
- See `PHASE2B-COMPLETE.md` for detailed completion report

**Phase 2C**: ⏳ **NOT STARTED** - Animated Cipher Wheel  
**Phase 2D**: ⏳ **NOT STARTED** - Integration & Polish

---

## Overview

Phase 2 builds upon the completed Phase 1 implementation to add three major enhancements:
1. **Animated Cipher Wheel** - Visual representation with rotating inner ring
2. **Copy to Clipboard** - For both encoded and decoded text boxes
3. **Dark Mode** - Theme toggle functionality

---

## Phase 2 Requirements

Based on `docs/ui.md` and user feedback:

### 1. Animated Cipher Wheel
- Display two concentric circles (outer stationary, inner rotating)
- Outer ring: 26 Gaileen cipher symbols
- Inner ring: Alphabet (A-Z) with shift indicator window
- Idle state: Slow continuous rotation
- Active state: Step through each character's shift position during encode/decode
- **User-configurable speed slider** for animation speed
- Visual design: Concentric circles with solid lines dividing characters

### 2. Copy to Clipboard
- Add copy buttons for both Encode and Decode text boxes
- Visual feedback when text is copied
- Disabled state when text box is empty

### 3. Dark Mode
- Toggle between light and dark themes
- Persist user preference
- Respect system preference on first load
- Smooth transitions between themes

---

## Technology Stack

- **Frontend**: React with TypeScript (existing)
- **Animation**: CSS transforms and React state
- **Styling**: CSS with CSS variables for theming
- **Testing**: Jest + React Testing Library (existing)

---

## Project Structure Updates

```
frontend/src/
├── components/
│   ├── CipherForm.tsx (update)
│   ├── CipherWheel.tsx (new)
│   ├── CopyButton.tsx (new)
│   ├── ThemeToggle.tsx (new)
│   ├── InputBox.tsx (existing)
│   └── KeyInput.tsx (existing)
├── contexts/
│   └── ThemeContext.tsx (new)
├── hooks/
│   ├── useCipher.ts (existing)
│   └── useTheme.ts (new)
├── utils/
│   └── clipboard.ts (new)
├── App.tsx (update - wrap with ThemeProvider)
└── App.css (update - add dark mode variables)
```

---

## Detailed Implementation Plan

### Phase 2A - Copy to Clipboard (Estimated: 1-2 hours)

#### Components

**2A.1 `CopyButton.tsx`**
```typescript
interface CopyButtonProps {
  text: string
  disabled?: boolean
  label?: string
}
```
- Uses Clipboard API: `navigator.clipboard.writeText()`
- Shows visual feedback (icon change or "Copied!" message)
- Auto-resets feedback after 2-3 seconds
- Accessible with ARIA labels
- Keyboard navigable

**2A.2 `utils/clipboard.ts`**
```typescript
export async function copyToClipboard(text: string): Promise<boolean>
export function isCopySupported(): boolean
```
- Wrapper for clipboard operations
- Error handling
- Browser compatibility checks

**2A.3 Integration into `CipherForm.tsx`**
- Add `CopyButton` next to each text area
- Pass the appropriate text (encodeText or decodeText)
- Disable when text is empty

#### Features
- ✅ Click to copy text to clipboard
- ✅ Visual feedback (success/error states)
- ✅ Disabled state when text box is empty
- ✅ Accessible with keyboard navigation
- ✅ ARIA labels for screen readers

#### Tests
- `CopyButton.test.tsx`:
  - Renders correctly
  - Calls clipboard API on click
  - Shows success feedback
  - Handles errors gracefully
  - Respects disabled state
  - Keyboard accessible

---

### Phase 2B - Dark Mode (Estimated: 2-3 hours)

#### Components

**2B.1 `ThemeContext.tsx`**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }>
export const useTheme: () => ThemeContextType
```
- Manages global theme state
- Persists to localStorage
- Respects system preference on first load (`prefers-color-scheme`)

**2B.2 `ThemeToggle.tsx`**
```typescript
interface ThemeToggleProps {
  className?: string
}
```
- Button/switch to toggle theme
- Visual indicator (sun/moon icon or similar)
- Accessible with ARIA labels
- Keyboard navigable

**2B.3 CSS Updates (`App.css`)**
```css
:root {
  /* Light mode variables (existing) */
}

[data-theme="dark"] {
  --primary-color: #5ba3ff;
  --primary-hover: #4a8fe0;
  --text-color: #e0e0e0;
  --bg-color: #1a1a1a;
  --card-bg: #2d2d2d;
  --border-color: #444;
  --disabled-bg: #3a3a3a;
  --disabled-text: #888;
  --error-color: #ff6b6b;
  --success-color: #51cf66;
  /* ... etc */
}
```

**2B.4 Integration into `App.tsx`**
- Wrap app with `ThemeProvider`
- Add `ThemeToggle` to header/navbar
- Apply theme attribute to root element

#### Features
- ✅ Toggle between light and dark themes
- ✅ Persist preference in localStorage
- ✅ Respect system preference on first load
- ✅ Smooth transitions between themes
- ✅ All components work in both themes
- ✅ WCAG AA color contrast compliance

#### Tests
- `ThemeContext.test.tsx`:
  - Provides theme context correctly
  - Toggles theme
  - Persists to localStorage
  - Respects system preference
- `ThemeToggle.test.tsx`:
  - Renders correctly
  - Calls toggleTheme on click
  - Shows correct icon for current theme
  - Keyboard accessible

---

### Phase 2C - Animated Cipher Wheel (Estimated: 4-6 hours)

#### Component Design

**2C.1 `CipherWheel.tsx`**
```typescript
interface CipherWheelProps {
  isAnimating: boolean
  animationSequence?: number[]  // Array of shift positions to animate through
  animationSpeed: number        // Speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
  onAnimationComplete?: () => void
}
```

**Visual Structure:**
- Two concentric circles (SVG or CSS-based)
- **Outer Ring (Stationary)**:
  - 26 segments for Gaileen cipher symbols
  - Symbols: `[">","<","^","v",">>","<<",".",".>","<.","^.",".v","..","O","Ø","X","/","\\","\\\\","//","/.","\\.","./",".\\",":","+","="]`
  - Solid lines dividing each segment
  - Fixed position
  
- **Inner Ring (Rotating)**:
  - 26 segments for alphabet (A-Z)
  - Shift indicator window showing numbers 0-25
  - Rotates to align with outer ring
  - CSS transform: `rotate(${angle}deg)`

**Animation States:**
1. **Idle**: Slow continuous rotation (1 full rotation per 60 seconds)
2. **Encoding/Decoding**: 
   - Step through each character in the input
   - Rotate to align the shift position for that character
   - Pause briefly (200-500ms based on speed setting)
   - Continue to next character
3. **Paused**: No rotation

**Animation Logic:**
```typescript
// For each character in the text:
// 1. Calculate target rotation angle based on shift value
// 2. Animate rotation to target angle
// 3. Pause to show alignment
// 4. Move to next character

const anglePerSegment = 360 / 26;
const targetAngle = shiftValue * anglePerSegment;
```

**2C.2 Speed Control Slider**
- Add slider component to control animation speed
- Range: 0.5x (slow) to 3x (fast)
- Default: 1x (normal)
- Updates `animationSpeed` prop in real-time

**2C.3 Integration into `CipherForm.tsx`**
- Add `CipherWheel` component to layout
- **Layout: Option A (Center Stage)**:
  - Wheel in the center
  - Encode input on the left
  - Decode input on the right
  - Key input at the top
  - Speed slider near the wheel
  - Responsive: Stacks vertically on mobile

- Pass animation state:
  ```typescript
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSequence, setAnimationSequence] = useState<number[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  ```

- When encode/decode button clicked:
  - Calculate animation sequence from key pattern
  - Set `isAnimating` to true
  - Pass sequence to wheel
  - Wait for animation to complete
  - Then show result

#### Features
- ✅ Two-layer concentric circle design
- ✅ Outer ring with 26 cipher symbols (stationary)
- ✅ Inner ring with A-Z and shift window (rotating)
- ✅ Idle animation (slow continuous rotation)
- ✅ Character-by-character animation during encode/decode
- ✅ User-configurable speed slider
- ✅ Smooth CSS transitions
- ✅ Responsive design (scales on mobile)
- ✅ Respects `prefers-reduced-motion`

#### Tests
- `CipherWheel.test.tsx`:
  - Renders correctly
  - Shows all 26 symbols on outer ring
  - Shows all 26 letters on inner ring
  - Rotates during animation
  - Respects animation speed
  - Calls onAnimationComplete
  - Handles empty animation sequence
  - Respects reduced motion preference

---

### Phase 2D - Integration & Polish (Estimated: 1-2 hours)

#### Layout Updates

**2D.1 `CipherForm.tsx` Layout**
```
┌─────────────────────────────────────────┐
│           Gaileen Cipher        [Theme] │
├─────────────────────────────────────────┤
│              Key Input                   │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Encode  │  │ Cipher  │  │ Decode  │ │
│  │ Input   │  │ Wheel   │  │ Input   │ │
│  │ [Copy]  │  │         │  │ [Copy]  │ │
│  │ [Encode]│  │ [Speed] │  │ [Decode]│ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

**Mobile Layout (< 768px):**
```
┌─────────────────┐
│ Gaileen  [Theme]│
├─────────────────┤
│   Key Input     │
├─────────────────┤
│  Cipher Wheel   │
│    [Speed]      │
├─────────────────┤
│  Encode Input   │
│     [Copy]      │
│    [Encode]     │
├─────────────────┤
│  Decode Input   │
│     [Copy]      │
│    [Decode]     │
└─────────────────┘
```

**2D.2 Responsive Design**
- Wheel scales down on smaller screens
- Inputs stack vertically on mobile
- Touch-friendly button sizes
- Readable text at all sizes

**2D.3 Dark Mode Integration**
- Ensure wheel is visible in dark mode
- Adjust colors for good contrast
- Test all components in both themes

**2D.4 Accessibility Audit**
- All interactive elements keyboard accessible
- Proper ARIA labels on all components
- Focus management works correctly
- Screen reader announcements for state changes
- Color contrast meets WCAG AA in both themes
- Animations respect `prefers-reduced-motion`

**2D.5 Performance Optimization**
- Use CSS transforms for animations (GPU-accelerated)
- Debounce speed slider updates if needed
- Optimize re-renders with React.memo where appropriate
- Test animation performance on lower-end devices

#### Final Testing
- [ ] All features work together
- [ ] Responsive design on all screen sizes
- [ ] Dark mode works with all features
- [ ] Copy buttons work correctly
- [ ] Wheel animations are smooth
- [ ] Speed slider updates animation in real-time
- [ ] Accessibility features work correctly
- [ ] No console errors or warnings
- [ ] All tests pass

---

## Implementation Phases Summary

### Phase 2A - Copy to Clipboard (1-2 hours)
- [x] Create `utils/clipboard.ts` utility functions
- [x] Create `CopyButton.tsx` component
- [x] Integrate copy buttons into `CipherForm.tsx`
- [x] Add visual feedback (success/error states)
- [x] Write tests for copy functionality
- [x] Test accessibility (keyboard, screen readers)

### Phase 2B - Dark Mode (2-3 hours)
- [x] Create `ThemeContext.tsx` and `useTheme.ts` hook
- [x] Create `ThemeToggle.tsx` component
- [x] Update CSS with dark mode variables
- [x] Add theme persistence (localStorage)
- [x] Respect system preference on first load
- [x] Add smooth transitions between themes
- [x] Update all components to work with both themes
- [x] Write tests for theme functionality
- [x] Test visual consistency in both modes

### Phase 2C - Animated Cipher Wheel (4-6 hours)
- [ ] Create `CipherWheel.tsx` component structure
- [ ] Design and implement SVG/CSS wheel layout
- [ ] Add outer ring with Gaileen symbols (stationary)
- [ ] Add inner ring with alphabet and shift indicator (rotating)
- [ ] Implement idle rotation animation
- [ ] Implement character-by-character encoding animation
- [ ] Implement character-by-character decoding animation
- [ ] Add speed control slider
- [ ] Integrate wheel into `CipherForm.tsx` with Option A layout
- [ ] Add responsive design for mobile
- [ ] Write tests for wheel component
- [ ] Test animations and performance

### Phase 2D - Integration & Polish (1-2 hours)
- [ ] Update layout to accommodate all new features (Option A)
- [ ] Ensure responsive design works on all screen sizes
- [ ] Test dark mode with cipher wheel
- [ ] Test all features together
- [ ] Update documentation
- [ ] Final accessibility audit
- [ ] Performance optimization if needed

**Total Estimated Time: 8-13 hours**

---

## Key Design Decisions

### 1. Cipher Wheel Animation - Character-by-Character (Option 1)
**Rationale**: Most educational and visually engaging. Shows how the cipher works step-by-step.
- For each character, rotate to show its shift position
- Pause briefly to show the alignment
- Continue to next character
- User can control speed with slider

### 2. Layout - Center Stage (Option A)
**Rationale**: Makes the wheel the focal point and creates a balanced, engaging layout.
- Wheel in the center
- Encode input on the left
- Decode input on the right
- Key input at the top
- Stacks vertically on mobile

### 3. Speed Control - User-Configurable Slider
**Rationale**: Gives users control over the experience. Some may want to see it slowly for educational purposes, others may want it faster.
- Range: 0.5x (slow) to 3x (fast)
- Default: 1x (normal)
- Updates animation in real-time

### 4. Wheel Visual Design
**Rationale**: Based on reference image but adapted for web.
- Concentric circles with solid dividing lines
- Clear, readable symbols and letters
- Shift indicator window on inner ring
- Good contrast in both light and dark modes

### 5. Dark Mode Implementation
**Rationale**: Modern UX expectation, reduces eye strain.
- Context-based for global state management
- localStorage for persistence
- System preference detection
- Smooth transitions

---

## Testing Strategy

### Component Tests

**Copy Functionality:**
- `CopyButton.test.tsx`:
  - Renders correctly
  - Copies text to clipboard
  - Shows success feedback
  - Handles errors
  - Respects disabled state
  - Keyboard accessible

**Theme Functionality:**
- `ThemeContext.test.tsx`:
  - Provides theme context
  - Toggles theme
  - Persists to localStorage
  - Respects system preference
- `ThemeToggle.test.tsx`:
  - Renders correctly
  - Toggles theme on click
  - Shows correct icon
  - Keyboard accessible

**Cipher Wheel:**
- `CipherWheel.test.tsx`:
  - Renders correctly
  - Shows all symbols and letters
  - Rotates during animation
  - Respects animation speed
  - Calls onAnimationComplete
  - Handles empty sequence
  - Respects reduced motion

### Integration Tests

- Theme switching affects all components
- Copy buttons work with encoded/decoded text
- Wheel animations sync with encode/decode operations
- Speed slider updates wheel animation
- Dark mode works with all features
- Responsive layout works on all screen sizes

### Accessibility Tests

- All interactive elements keyboard accessible
- Proper ARIA labels on all components
- Focus management works correctly
- Screen reader announcements for state changes
- Color contrast meets WCAG AA in both themes
- Animations respect `prefers-reduced-motion`

### Performance Tests

- Wheel animations are smooth (60fps)
- No jank during rotation
- Speed slider updates don't cause lag
- Theme switching is instant
- No memory leaks from animations

**Test Coverage Goal: >80% for all new code**

---

## Success Criteria

### Functional Requirements
- ✅ Animated cipher wheel displays correctly
- ✅ Wheel rotates slowly when idle
- ✅ Wheel animates character-by-character during encode/decode
- ✅ Speed slider controls animation speed
- ✅ Copy buttons copy text to clipboard
- ✅ Copy buttons show visual feedback
- ✅ Dark mode toggle switches themes
- ✅ Theme preference persists across sessions
- ✅ All features work together seamlessly

### Non-Functional Requirements
- ✅ Responsive design (mobile-friendly)
- ✅ Accessible (keyboard navigation, ARIA labels, screen readers)
- ✅ Smooth animations (60fps)
- ✅ Fast response times
- ✅ >80% test coverage
- ✅ Clean, maintainable code following SOLID principles
- ✅ WCAG AA color contrast in both themes

### Documentation
- ✅ Updated README with new features
- ✅ Code comments for complex logic
- ✅ Test documentation

---

## Future Enhancements (Phase 3+)

These are NOT part of Phase 2 but could be considered later:

- Keyboard shortcuts for encode/decode
- Export/import functionality
- Message history/saved messages
- Share encoded messages via URL
- Custom symbol sets
- Multiple cipher algorithms
- Batch encode/decode
- Sound effects for wheel rotation
- Haptic feedback on mobile

---

## References

- [Gaileen Cipher Article](https://www.worldanvil.com/w/anvimar-ilionblaze/a/gaileen-cipher-article)
- [Phase 1 Implementation Plan](./phase1-implementation-plan.md)
- [React Documentation](https://react.dev/)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**End of Phase 2 Implementation Plan**
