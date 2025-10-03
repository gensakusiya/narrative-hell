# Narrative Hell - Story Flow Designer for VSCode

Visual story designer for games with branching narratives. Write your game's story in a simple text format and see it come to life with syntax highlighting, validation, and visualization.

## Features

- 🎨 **Syntax Highlighting** - Beautiful colors for events, choices, dialogue, and effects
- ✅ **Real-time Validation** - Finds dead ends, unreachable events, and broken links
- 📊 **Story Graph** - Visualize your narrative flow (coming soon)
- 🔍 **Hover Information** - See what effects and transitions do
- ⚡ **Quick Actions** - Simulate story paths with CodeLens

## File Format

Create files with `.nhell` or `.nh` extension:

```nhell
=== metadata ===
id: family_crisis
author: YourName
version: 1.0

=== state ===
family: 70
budget: 100
stress: 30

=== start ===
# Opening Scene
The phone rings. It's deadline day.

* [Answer eagerly] -> agent_call
  ~ stress +5
  ~ time -10
  
* [Let it ring] -> missed_opportunity
  ~ stress -5
  ~ mood -10

=== agent_call ===
# Agent on the Line
"I have the perfect player for you!"

* [Negotiate] -> negotiation
  ~ time -30
  
* [Hang up] -> END
  ~ mood -5
```

## Syntax Guide

### Events
```
=== event_name ===
```

### Titles
```
# Scene Title
```

### Dialogue
```
Character: "What they say"
```

### Choices
```
* [Choice text] -> next_event
```

### Effects
```
~ variable +10   // Increase
~ variable -5    // Decrease
~ flag: flag_name // Set flag
```

### Flow Control
```
-> next_event    // Go to event
-> END          // End story
```

### Comments
```
// Single line comment
/* Multi-line
   comment */
```

## Commands

- **Show Story Graph** - Visualize your narrative flow
- **Validate Story Flow** - Check for issues
- **Simulate from Here** - Test story paths

## Validation Checks

The extension automatically checks for:

- 🔴 **Missing events** - References to non-existent events
- 🟡 **Unreachable events** - Events that are never referenced  
- 🟡 **Dead ends** - Events with no choices or transitions
- 🔴 **Infinite loops** - Circular references without exit

## Installation

1. Install from VSCode Marketplace (coming soon)
2. Or build from source:
   ```bash
   npm install
   npm run compile
   ```

## Contributing

Found a bug or have a feature request? Open an issue on GitHub!

## License

MIT
