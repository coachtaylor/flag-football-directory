# Supabase Setup Required for Free Agents

## Issue Fixed
The API route has been updated to handle FormData (for file uploads) from the free agent form. However, you need to set up Supabase Storage to accept the media uploads.

## Steps to Complete Setup

### 1. Create Storage Bucket in Supabase

Go to your Supabase Dashboard → Storage → Create a new bucket:

**Bucket Settings:**
- **Name:** `free-agent-media`
- **Public bucket:** Yes (checked)
- **File size limit:** 52428800 (50MB)
- **Allowed MIME types:** Leave empty or specify: `image/*,video/*`

### 2. Set Storage Policies

After creating the bucket, click on it and go to "Policies" tab, then add these policies:

#### Policy 1: Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'free-agent-media');
```

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'free-agent-media' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Authenticated Update
```sql
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'free-agent-media' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 4: Authenticated Delete
```sql
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'free-agent-media' 
  AND auth.role() = 'authenticated'
);
```

### 3. Alternative: Run SQL Script

Or, you can run the SQL script I created:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy the contents of `supabase/free_agents_setup.sql`
4. Execute the query

### 4. Test the Form

After setting up the storage bucket:

1. Go to `/add-program/free-agent`
2. Fill out the form
3. Upload photos/videos
4. Click "List as Free Agent"
5. Check Supabase:
   - Storage → `free-agent-media` → Should see uploaded files
   - Table Editor → `submissions` → Should see new entry with type='free-agent'

## How It Works Now

### API Route (`/api/submit`)
The API now handles two types of requests:

**FormData (Free Agent with files):**
```typescript
POST /api/submit
Content-Type: multipart/form-data

Fields:
- type: 'free-agent'
- first_name, last_name, email, etc.
- photo_0, photo_1, ... (File objects)
- video_0, video_1, ... (File objects)
- photo_count, video_count
```

**JSON (Other forms):**
```typescript
POST /api/submit
Content-Type: application/json

{
  "type": "team" | "league" | "clinic" | "tournament",
  "payload": { ... }
}
```

### Storage Structure
```
free-agent-media/
├── photos/
│   ├── 1234567890_0_image1.jpg
│   ├── 1234567891_1_image2.png
│   └── ...
└── videos/
    ├── 1234567890_0_video1.mp4
    ├── 1234567891_1_video2.mov
    └── ...
```

### Data Stored in Submissions Table
```json
{
  "type": "free-agent",
  "payload": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "instagram": "johndoe",
    "city": "Chicago",
    "state": "IL",
    "age_category": "ADULT",
    "gender": "male",
    "skill_level": "advanced",
    "photo_urls": [
      "https://your-project.supabase.co/storage/v1/object/public/free-agent-media/photos/..."
    ],
    "video_urls": [
      "https://your-project.supabase.co/storage/v1/object/public/free-agent-media/videos/..."
    ],
    ...
  },
  "source": "api",
  "status": "new"
}
```

## Optional: Create Dedicated Free Agents Table

If you want a separate table instead of using `submissions`:

1. Uncomment the SQL in `supabase/free_agents_setup.sql`
2. Run it in SQL Editor
3. Update API route line 83 to use `free_agents` table instead of `submissions`

```typescript
// Change this:
const { error } = await supabase.from('submissions').insert([...])

// To this:
const { error } = await supabase.from('free_agents').insert([{
  ...payload,
  user_id: user?.id // if you want to track who created it
}])
```

## Troubleshooting

### Error: "Bucket not found"
- Make sure you created the `free-agent-media` bucket in Supabase Storage
- Check the bucket name matches exactly (case-sensitive)

### Error: "Permission denied"
- Ensure storage policies are set up correctly
- Verify user is authenticated when submitting
- Check RLS policies on storage.objects

### Error: "File too large"
- Default limit is 50MB per file
- Adjust in Supabase Storage bucket settings if needed

### Files upload but URL returns 404
- Make sure bucket is set to "Public"
- Check storage policies allow public SELECT

## Current Status

✅ API route updated to handle FormData  
✅ File uploads to Supabase Storage implemented  
✅ Photo and video processing added  
⚠️ **Requires Supabase Storage bucket setup** (see steps above)  
⚠️ Currently stores in `submissions` table (optional: create dedicated `free_agents` table)

After completing the storage setup, the free agent form should work end-to-end! 🎉

