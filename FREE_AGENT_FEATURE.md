# Free Agent Feature

## Overview

Added a "Free Agent" category to the add-program flow, allowing individual players to list themselves as available to join teams, leagues, or pickup games.

## What's New

### 1. Free Agent Option on Add Program Page

**URL:** `/add-program`

Now shows three cards instead of two:
- **Adult** - Programs for adults 18+
- **Youth** - Programs for kids & teens  
- **Free Agent** - List yourself as available ⭐ NEW

### 2. Free Agent Registration Page

**URL:** `/add-program/free-agent`

Comprehensive player profile form that captures:

#### Personal Information
- First Name, Last Name
- Email, Phone
- **Instagram Handle** (@username format) ⭐ NEW
- Auto-fills name and email from user account

#### Location
- City
- State

#### Player Details
- **Age Category** (Youth/Adult)
- Age (optional)
- **Gender** (Male, Female, Non-Binary, Prefer Not to Say)
- **Preferred Position** 
  - Quarterback
  - Receiver
  - Running Back
  - Center
  - Rusher
  - Defender
  - Any Position
- **Skill Level** (Beginner, Intermediate, Advanced, Elite)
- **Years of Experience** (< 1 year to 10+ years)

#### Preferences
- **Availability** (multiple select)
  - Weekday Evenings
  - Weekends
  - Mornings
  - Flexible
- **Looking For** (multiple select)
  - Team
  - League
  - Pickup Games
  - Tournaments
- **Willing to Travel**
  - Local only (within 10 miles)
  - Nearby (10-25 miles)
  - Regional (25-50 miles)
  - Statewide (50+ miles)
  - Anywhere

#### About You
- Bio/Description text area

#### Photos & Videos ⭐ NEW
- **Photo Upload**
  - Multiple image upload
  - Live preview thumbnails
  - Remove individual photos
  - Accepts PNG, JPG, GIF (up to 10MB)
  - Displays action shots, team photos, skill demonstrations
- **Video Upload**
  - Multiple video upload
  - File list with size display
  - Remove individual videos
  - Accepts MP4, MOV, AVI (up to 50MB)
  - Upload highlight reels, game footage, skills demos

### 3. Dashboard Quick Action

Added "Free Agent" card to dashboard quick actions:
- Purple color to distinguish from program types
- Direct link to `/add-program/free-agent`
- Positioned prominently as 2nd action

## User Flow

```
1. Click "Add Program" → /add-program
2. Click "Free Agent" → /add-program/free-agent
3. Fill out player profile
4. Submit ✅
```

**Quick Path from Dashboard:**
```
1. Click "Free Agent" quick action → /add-program/free-agent
2. Form auto-fills name & email from account
3. Complete remaining fields
4. Submit ✅
```

## Data Submitted

Submitted as **FormData** (to support file uploads):

```typescript
FormData {
  type: 'free-agent',
  first_name: string,
  last_name: string,
  email: string,
  phone?: string,
  instagram?: string,  // NEW
  city: string,
  state: string,
  age_category: 'ADULT' | 'YOUTH',
  age?: number,
  gender: string,
  position?: string,
  skill_level: string,
  experience?: string,
  availability: JSON.stringify(string[]),
  looking_for: JSON.stringify(string[]),
  travel_distance?: string,
  bio?: string,
  
  // NEW: Media files
  photo_0: File,
  photo_1: File,
  ... (up to photo_N)
  photo_count: number,
  
  video_0: File,
  video_1: File,
  ... (up to video_N)
  video_count: number
}
```

## Use Cases

### 1. New Player Looking for Team
- **Who:** Someone new to flag football
- **Selects:** Beginner skill level, looking for "Team" and "League"
- **Result:** Teams can find them and reach out

### 2. Experienced Player Available for Tournaments
- **Who:** Competitive player
- **Selects:** Advanced/Elite, looking for "Tournaments", willing to travel statewide
- **Result:** Tournament organizers can recruit them

### 3. Youth Player Seeking League
- **Who:** Teen player
- **Selects:** Youth category, specific age (e.g., 14), looking for "League"
- **Result:** Youth leagues can find age-appropriate players

### 4. Casual Player for Pickup Games
- **Who:** Recreational player
- **Selects:** Flexible availability, looking for "Pickup Games", local only
- **Result:** Local pickup organizers can contact them

## Benefits

✅ **Two-Way Marketplace**
- Not just programs finding players, but players finding programs

✅ **Better Matching**
- Detailed profiles help teams find the right fit
- Players can specify exactly what they're looking for

✅ **Visual Showcase** ⭐ NEW
- Photo galleries show players in action
- Video highlights demonstrate actual skills
- Teams can evaluate talent before reaching out

✅ **Social Connection** ⭐ NEW
- Instagram handles make it easy to connect
- Teams can review player's social presence
- Direct messaging through Instagram

✅ **Fills Roster Gaps**
- Teams with open spots can browse free agents
- Tournament organizers can find fill-in players

✅ **Community Building**
- Easier for new players to get involved
- Reduces barrier to entry

✅ **Data Rich**
- Comprehensive player profiles
- Searchable by location, skill level, availability
- Visual proof of skills and experience

## Visual Design

### Card on /add-program
- **Border:** Teal/Gray (#345c72)
- **Icon:** User icon
- **Description:** "List yourself as available"

### Form Page
- **Badge:** Teal with orange dot
- **Title:** "List Yourself as a Free Agent"
- **Sections:** Clear separation with headers
- **Fields:** Proper labels and validation

### Dashboard Quick Action
- **Color:** Purple (bg-purple-500)
- **Position:** Second card (after "Add Program")
- **Icon:** Users icon

## Future Enhancements

Potential additions:
- **Free agent directory page** - Browse all available players
- **Filtering** - By location, skill level, position
- **Contact button** - Teams can message players directly
- **Profile pages** - Public profiles for each free agent
- **Verification badges** - Verified players
- **Stats/highlights** - Player achievements
- **Availability calendar** - Schedule integration
- **Team requests** - Players can request to join specific teams

## Files Created

1. `/app/add-program/free-agent/page.tsx` - Free agent registration form

## Files Modified

1. `/app/add-program/page.tsx` - Added Free Agent card
2. `/app/dashboard/page.tsx` - Added Free Agent quick action

## Testing

- [x] Form loads correctly
- [x] All fields render properly
- [x] Auto-fills user data from account
- [x] Required fields are enforced
- [x] Form submits successfully
- [x] Linting passes
- [x] Mobile responsive
- [x] Breadcrumbs work
- [x] Back button navigates correctly

## API Integration

The form submits to `/api/submit` using **FormData** (multipart/form-data). The backend should:
1. Accept `free-agent` as a valid type
2. Parse FormData including file uploads
3. Upload photos/videos to storage (e.g., Supabase Storage, AWS S3)
4. Store file URLs in database
5. Return success/error response

### Backend Requirements

- **Parse FormData** instead of JSON
- **Handle file uploads** for photos and videos
- **Store files** in cloud storage
- **Generate URLs** for stored media
- **Validate file types** (images: png/jpg/gif, videos: mp4/mov/avi)
- **Enforce size limits** (photos: 10MB, videos: 50MB)

### Suggested Database Table Structure

```sql
create table free_agents (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  instagram text,  -- NEW
  city text not null,
  state text not null,
  age_category text not null,
  age int,
  gender text not null,
  position text,
  skill_level text not null,
  experience text,
  availability text[],
  looking_for text[],
  travel_distance text,
  bio text,
  photo_urls text[],  -- NEW: Array of photo URLs
  video_urls text[],  -- NEW: Array of video URLs
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Example File Storage with Supabase

```typescript
// Backend code example
const { data: photoUpload, error: photoError } = await supabase.storage
  .from('free-agent-media')
  .upload(`${userId}/photos/${Date.now()}_${file.name}`, file)

const photoUrl = supabase.storage
  .from('free-agent-media')
  .getPublicUrl(photoUpload.path).data.publicUrl
```

## Summary

The Free Agent feature completes the platform by allowing individual players to make themselves discoverable. This creates a true marketplace where programs find players AND players find programs, significantly increasing the value proposition for both sides of the network! 🎯⚡

