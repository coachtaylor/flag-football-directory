# Add Program Flow - Visual Guide

## 📍 Step 1: Choose Age Category

**URL:** `/add-program`

```
┌─────────────────────────────────────────────┐
│         Add a Program                        │
│  First, select the age category for your    │
│              program                         │
└─────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│      👥 Adult        │  │      🎓 Youth        │
│                      │  │                      │
│ Programs for adults  │  │ Programs for kids &  │
│       18+            │  │       teens          │
│                      │  │                      │
│  [Select adult] →    │  │  [Select youth] →    │
└──────────────────────┘  └──────────────────────┘
```

---

## 📍 Step 2A: Choose Adult Program Type

**URL:** `/add-program/adult`

```
┌─────────────────────────────────────────────┐
│      What type of adult program?            │
└─────────────────────────────────────────────┘

┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  👥 Team  │  │  🚩 League │  │  🎓 Clinic│  │  🏆 Tour. │
│           │  │            │  │           │  │           │
│   Adult   │  │   Season-  │  │   Skills  │  │   Travel  │
│   squads  │  │    long    │  │     &     │  │    comp.  │
│           │  │            │  │  training │  │           │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
      │              │               │               │
      └──────────────┴───────────────┴───────────────┘
                         │
                    [Select Type]
                         │
                         ▼
              /add-program/adult/[type]
```

---

## 📍 Step 2B: Choose Youth Program Type

**URL:** `/add-program/youth`

```
┌─────────────────────────────────────────────┐
│      What type of youth program?            │
└─────────────────────────────────────────────┘

┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  👥 Team  │  │  🚩 League │  │  🎓 Clinic│  │  🏆 Tour. │
│           │  │            │  │           │  │           │
│   Youth   │  │   Season-  │  │   Skills  │  │   Travel  │
│   squads  │  │    long    │  │     &     │  │    comp.  │
│           │  │            │  │  training │  │           │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
      │              │               │               │
      └──────────────┴───────────────┴───────────────┘
                         │
                    [Select Type]
                         │
                         ▼
              /add-program/youth/[type]
```

---

## 📍 Step 3A: Adult Program Form

**URL:** `/add-program/adult/[type]`

```
┌─────────────────────────────────────────────┐
│         Add an Adult League                  │
└─────────────────────────────────────────────┘

📋 Basic Information
┌─────────────────────────────────────────────┐
│ Name:    [________________]                 │
│ Website: [________________]                 │
│ City:    [________________]                 │
│ State:   [▼ Select state ]                 │
│ About:   [________________]                 │
│          [________________]                 │
└─────────────────────────────────────────────┘

📊 Program Details
┌─────────────────────────────────────────────┐
│ Gender:                                     │
│   ○ Men    ○ Women    ○ Co-Ed              │
│                                             │
│ Competition Level:                          │
│   ☐ Rec    ☐ Competitive    ☐ Elite       │
│                                             │
│ Game Format:                                │
│   ☐ 5v5    ☐ 7v7    ☐ 8v8                 │
│                                             │
│ Contact Type:                               │
│   ○ Non-Contact    ○ Contact               │
└─────────────────────────────────────────────┘

[Submit Program]  [Back]
```

**Key Differences:**
- Gender: **Men, Women, Co-Ed** ✅
- No age group selection (implied adult)

---

## 📍 Step 3B: Youth Program Form

**URL:** `/add-program/youth/[type]`

```
┌─────────────────────────────────────────────┐
│         Add a Youth League                   │
└─────────────────────────────────────────────┘

📋 Basic Information
┌─────────────────────────────────────────────┐
│ Name:    [________________]                 │
│ Website: [________________]                 │
│ City:    [________________]                 │
│ State:   [▼ Select state ]                 │
│ About:   [________________]                 │
│          [________________]                 │
└─────────────────────────────────────────────┘

📊 Program Details
┌─────────────────────────────────────────────┐
│ Gender:                                     │
│   ○ Boys    ○ Girls    ○ Co-Ed             │
│                                             │
│ Age Groups:                                 │
│   ☐ 6U   ☐ 8U   ☐ 10U   ☐ 12U             │
│   ☐ 14U  ☐ 16U  ☐ 18U                     │
│                                             │
│ Competition Level:                          │
│   ☐ Rec    ☐ Competitive    ☐ Elite       │
│                                             │
│ Game Format:                                │
│   ☐ 5v5    ☐ 7v7    ☐ 8v8                 │
│                                             │
│ Contact Type:                               │
│   ○ Non-Contact    ○ Contact               │
└─────────────────────────────────────────────┘

[Submit Program]  [Back]
```

**Key Differences:**
- Gender: **Boys, Girls, Co-Ed** ✅
- Age Groups: Multiple selections available ✅

---

## 🎯 Navigation Shortcuts

From the dashboard, users can skip ahead:

```
Dashboard Quick Actions:
┌─────────────────────────────────────────────┐
│  [+ Add Program]           → /add-program    │
│  [👥 Add Adult Program]    → /add-program/adult │
│  [🎓 Add Youth Program]    → /add-program/youth │
│  [🌍 Browse Directory]     → /               │
└─────────────────────────────────────────────┘
```

This gives flexibility for:
- **New users:** Start at `/add-program` and be guided through
- **Power users:** Jump directly to adult or youth selection

---

## 🔄 Complete Flow Examples

### Example 1: Adding Adult Men's League
```
1. Click "Add Program" → /add-program
2. Click "Adult" → /add-program/adult
3. Click "League" → /add-program/adult/league
4. Fill form with:
   ✓ Name: "Chicago Men's Flag League"
   ✓ Gender: Men
   ✓ No age groups (adult implied)
5. Submit ✅
```

### Example 2: Adding Youth Girls Team (Quick Path)
```
1. Click "Add Youth Program" → /add-program/youth
2. Click "Team" → /add-program/youth/team
3. Fill form with:
   ✓ Name: "Lightning Girls"
   ✓ Gender: Girls
   ✓ Age Groups: 10U, 12U
4. Submit ✅
```

---

## ✨ Benefits at Each Step

### Step 1 (Age Category)
- ✅ Immediately sets context
- ✅ Simple binary choice
- ✅ Clear visual distinction

### Step 2 (Program Type)
- ✅ Four familiar options
- ✅ Age context already set
- ✅ Descriptions match age category

### Step 3 (Form)
- ✅ Labels appropriate for age
- ✅ Fields relevant to category
- ✅ Clear submission path

---

## 📱 Mobile Experience

All three steps are optimized for mobile:
- Large, touch-friendly cards
- Clear hierarchy
- Minimal scrolling per step
- Breadcrumbs for navigation

---

## 🎨 Visual Consistency

### Color Coding
- **Adult:** Dark blue badges (#001f3d)
- **Youth:** Orange badges (#e87a00)
- **Consistent** across all steps

### Iconography
- 👥 Users - Adult/Teams
- 🎓 Academic - Youth/Training
- 🚩 Flag - Leagues
- 🏆 Trophy - Tournaments

This visual language helps users orient themselves throughout the flow!

