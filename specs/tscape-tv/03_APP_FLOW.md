# 🔀 Pillar 3: Application Flow & State Machines — TSCAPE TV

## 1. User Journey Flow
```mermaid
flowchart TD
    A["Visitor enters theflowscape.com/tv/ or clicks TSCAPE TV Nav Link"] --> B{"Load Catalog State"}
    B -->|"/api/tv/catalog returns Supabase rows"| C["Render Live Supabase Episodes"]
    B -->|"/api/tv/catalog offline or unconfigured"| D["Fallback to tv/catalog.json Manifest"]
    C & D --> E["Display Featured Broadcast & Grid"]
    E --> F["User Filters Category / Searches Channel"]
    F -->|Matches > 0| G["Animate Matching Episode Cards"]
    F -->|Matches == 0| H["Show Branded Calm Empty State + Reset CTA"]
    E & G --> I["User Clicks Play Episode"]
    I --> J{"Check video.source_type"}
    J -->|"youtube"| K["Inject youtube-nocookie.com iframe (autoplay=1, rel=0)"]
    J -->|"supabase or local"| L["Mount Native HTML5 Video Player (poster + MP4 stream)"]
```

## 2. Mandatory UI States
1. **Loading State**: Shimmer obsidian skeleton placeholders matching exact card dimensions (`16:9` aspect ratio) preventing Layout Shift (`CLS = 0`).
2. **Empty State**: If a user searches/filters a topic with 0 episodes, render a warm editorial prompt: *"No broadcasts match this rhythm yet"* with a **View All Transmissions** reset button.
3. **Error / Stream Unavailable State**: If a storage URL or external video fails to load, catch `video.onerror` cleanly and show an accessible fallback notification with a link to reserve or explore the destination retreat directly.
4. **Theater Modal State**: Focus-trapped cinema overlay (`role="dialog"`, `aria-modal="true"`), stopping playback immediately and clearing iframe `src` / pausing `<video>` when closed.
