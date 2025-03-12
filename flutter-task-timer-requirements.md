# Task Timer Flutter App - Project Requirements

## Project Overview

This document outlines the requirements for transforming an existing Next.js Task Timer application into a Flutter mobile app. The new application will maintain core functionality while introducing enhanced features, design patterns, and mobile-specific capabilities.

## Core Functionality

The Task Timer app helps users:
- Create and manage tasks with time estimates
- Track time spent on individual tasks and task groups
- View task history and completion statistics
- Earn points for completing tasks on time
- Redeem points for rewards
- Continue timing tasks even when the app is closed

## Design Patterns

### Composite Pattern for Task Timing
- Abstract `TimeableComponent` interface/class for uniform timing operations
- `Task` objects as leaf nodes
- `TaskGroup` objects as composite nodes
- Ability to nest groups within groups
- Users can start/stop entire groups at once
- When timing groups, the app tracks aggregate time
- If a group is completed on/before time, all children's average times should change proportionally:
  - Example: If Task A (60 min) and Task B (40 min) are grouped and completed in 50 min, Task A's completion time becomes 30 min and Task B's becomes 20 min

## API Requirements

Minimum two endpoints:

1. **Tasks Endpoint**
   - GET: Fetch all tasks and task groups
   - POST: Create new tasks/groups
   - PUT: Update existing tasks/groups
   - DELETE: Remove tasks/groups

2. **Stats Endpoint**
   - GET: Retrieve task history and completion statistics
   - GET: Retrieve daily stats
   - POST/PUT: Update daily stats
   - POST/PUT: Update task history

## Offline Functionality

- Server-first approach (try server connection first, fall back to local)
- Special isolated offline mode when no connection is available
- Users can add and time tasks in offline mode
- When connection is detected, prompt user to switch to online mode
- If user confirms switch, offline data is wiped and online data is loaded
- Active tasks continue timing through connection changes

## Task Timing

- Each task is timed independently
- Flutter app is responsible for timing (not server)
- Timing continues when app is closed
- No pausing of tasks is allowed (only start/complete)
- Background processing to notify users when tasks are about to expire (with toggle option)
- No task dependencies

## Statistics and History

- Chart displays showing 1W (1 week), 1M (1 month), and 3M (3 months) history
- Only track total score and completion rate for each day
- No need to store detailed tasks completed on specific days
- Display points earned today and total points sections

## Points and Rewards System

- Points earned only by completing tasks
- Point calculation based on task completion time vs. average completion time
- Rewards store with multiple tiers:
  - 50 points: Fetch and display a Chuck Norris joke from API
  - 100 points: [Premium reward to be determined]
  - 300 points: [Premium reward to be determined]
- Store items refresh periodically
- Redeemed rewards are not tracked in history

## Widget Implementation

- Minimal home screen widget showing active tasks
- Widget should only display information (no interactive capabilities)
- Widget updates as tasks progress

## Technical Implementation

### Architecture
- BLoC pattern for state management
- Repository pattern for data access
- Dependency injection for service locator

### Data Models
- TimeableComponent (abstract)
  - Task
  - TaskGroup
- DailyStats
- UserPoints
- StoreItem
- OfflineSession

### UI/UX Requirements
- Clean, intuitive interface
- Visual indicators for task status
- Charts for historical data
- Easy task creation and grouping
- Reward store with visual appeal

## Development Phases

1. Core app structure and design pattern implementation
2. Task management and timing functionality
3. Statistics and history features
4. Points system and rewards store
5. Widget and background service integration
6. Offline mode support
7. Testing and refinement

## Future Considerations

- Potential for cross-platform deployment
- Advanced analytics features
- Social sharing capabilities
- Integration with other productivity tools
