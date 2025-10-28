# Add Program Flow - Age-Appropriate Forms

## Problem Solved

Previously, the add program flow went directly from selecting a program type (Team, League, Clinic, Tournament) to a form with hardcoded "boys", "girls", "coed" gender options. This was inappropriate for adult programs, which should use "Men", "Women", "Co-Ed" instead.

## New Flow Structure

### Before
```
/add-program → Choose Type → Form with youth-only labels
```

### After
```
/add-program → Choose Age Category → Choose Type → Age-appropriate Form
```

## New URL Structure

### Level 1: Choose Age Category
**URL:** `/add-program`
- **Adult** → `/add-program/adult`
- **Youth** → `/add-program/youth`

### Level 2: Choose Program Type
**Adult Programs:** `/add-program/adult`
- Team → `/add-program/adult/team`
- League → `/add-program/adult/league`
- Clinic → `/add-program/adult/clinic`
- Tournament → `/add-program/adult/tournament`

**Youth Programs:** `/add-program/youth`
- Team → `/add-program/youth/team`
- League → `/add-program/youth/league`
- Clinic → `/add-program/youth/clinic`
- Tournament → `/add-program/youth/tournament`

### Level 3: Fill Out Form
Forms now have age-appropriate labels based on the URL path.

## Form Differences

### Adult Forms (`/add-program/adult/[type]`)
- **Gender Options:**
  - Men
  - Women
  - Co-Ed
- **Age Groups:** Not shown (automatically set to ADULT)
- **Badge Color:** Blue (#001f3d)
- **Breadcrumbs:** Add Program → Adult → [Type]

### Youth Forms (`/add-program/youth/[type]`)
- **Gender Options:**
  - Boys
  - Girls
  - Co-Ed
- **Age Groups:** 6U, 8U, 10U, 12U, 14U, 16U, 18U
- **Badge Color:** Orange (#e87a00)
- **Breadcrumbs:** Add Program → Youth → [Type]

## Files Created/Modified

### New Files
1. **`/app/add-program/adult/page.tsx`** - Adult program type selection
2. **`/app/add-program/youth/page.tsx`** - Youth program type selection
3. **`/app/add-program/adult/[type]/page.tsx`** - Adult program form
4. **`/app/add-program/youth/[type]/page.tsx`** - Youth program form

### Modified Files
1. **`/app/add-program/page.tsx`** - Changed from type selection to age category selection
2. **`/app/dashboard/page.tsx`** - Updated quick action links to match new flow

### Deleted Files
1. **`/app/add-program/[type]/page.tsx`** - Replaced by age-specific versions

## Data Submitted to API

Both forms now include an `age_category` field in the payload:
```typescript
{
  // ... other fields
  age_category: 'ADULT'  // or 'YOUTH'
}
```

This allows the backend to properly categorize submissions.

## User Experience Flow

### Example: Adding an Adult League

1. User clicks "Add Program" in navbar
2. Sees two cards: "Adult" and "Youth"
3. Clicks "Adult"
4. Sees four cards: Team, League, Clinic, Tournament
5. Clicks "League"
6. Fills form with appropriate labels:
   - Gender: Men, Women, or Co-Ed
   - No age groups shown (implied adult)
7. Submits

### Example: Adding a Youth Team

1. User clicks "Add Program" in navbar
2. Sees two cards: "Adult" and "Youth"
3. Clicks "Youth"
4. Sees four cards: Team, League, Clinic, Tournament
5. Clicks "Team"
6. Fills form with appropriate labels:
   - Gender: Boys, Girls, or Co-Ed
   - Age Groups: Can select multiple (6U, 8U, etc.)
7. Submits

## Dashboard Quick Actions

Updated to reflect new flow:
- **Add Program** - Goes to age category selection
- **Add Adult Program** - Skips to adult type selection
- **Add Youth Program** - Skips to youth type selection
- **Browse Directory** - Explores all programs

This gives users flexibility to either:
- Start from scratch (Add Program)
- Skip ahead if they know the category (Add Adult/Youth Program)

## Benefits

✅ **Age-Appropriate Language**
- Adult forms use "Men/Women" instead of "Boys/Girls"
- Youth forms use "Boys/Girls" as appropriate

✅ **Clear User Flow**
- Three-step process is intuitive
- Breadcrumbs show where you are

✅ **Maintainable Code**
- Separate forms are easier to maintain
- Age-specific logic is isolated

✅ **Better Data**
- Age category is explicitly captured
- Can be used for filtering and search

✅ **Scalable**
- Easy to add age-specific fields in the future
- Can customize forms per age category

## Testing Checklist

- [x] Linting passes for all new files
- [x] Adult form shows Men/Women/Co-Ed
- [x] Youth form shows Boys/Girls/Co-Ed
- [x] Youth form shows age group checkboxes
- [x] Adult form doesn't show age groups
- [x] Breadcrumbs navigate correctly
- [x] Dashboard quick actions point to correct URLs
- [x] Forms submit with age_category field

