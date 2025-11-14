# Data Structure Changes - Implementation Plan

## Overview
The automation workflow has changed, requiring updates to the dashboard data structure and handling.

---

## 📋 Current State vs New State

### 1. **Index Sheet** (No changes needed)
- **Fields**: Post_URL, Sheet_Link, Post Topic
- **Status**: ✅ Already working correctly
- **Action**: No changes required

---

### 2. **Scraped Data Sheets** (MAJOR CHANGES)

#### Current Structure:
- LinkedIn Post User
- Linkedin Post
- First Name
- Last Name
- **Company** ❌ (REMOVED)
- **Role** ❌ (REMOVED)
- **Headline** ❌ (REMOVED)
- **About** ❌ (REMOVED)
- **Engagement Type** ❌ (REMOVED)
- **Comment Text** ❌ (REMOVED)
- Profile URL

#### New Structure (Reduced Fields):
- ✅ LinkedIn Post User
- ✅ Linkedin Post
- ✅ First Name
- ✅ Last Name
- ✅ Profile URL

#### Sheet Name Format:
- **Old**: Various names
- **New**: `Post_Nov_13_2025_11_17_PM` (runtime generated format: `Post_MMM_DD_YYYY_HH_MM_AM/PM`)

#### Impact:
1. **TypeScript Types**: `ScrapedDataEntry` needs to make Company, Role, Headline, About, Engagement Type, Comment Text optional or removed
2. **Fetching Logic**: `fetchScrapedDataSheet` needs to handle reduced fields gracefully
3. **UI Components**: Scraped data table needs to remove/hide columns that don't exist
4. **Analytics**: Stats calculations that rely on Company/Role/Engagement need to be updated or removed
5. **Filtering**: Remove Company/Role/Engagement Type filters from scraped data view

---

### 3. **DM Data Sheet** (MAJOR CHANGES)

#### Current:
- Fetches from multiple DM sheets
- Searches for sheets with "DM" and "Approval" columns
- Looks in various sheet names and GIDs

#### New:
- **Single Source**: "Combined Leads" sheet (exact name)
- Contains leads data ready for Hyreach (DM generation)
- This sheet contains merged and deduplicated data from all post scraped data sheets

#### Impact:
1. **Fetching Logic**: `fetchAllDMData` should primarily fetch from "Combined Leads" sheet
2. **Sheet Detection**: Update to look for "Combined Leads" by name
3. **DM Structure**: May have different columns - needs investigation
4. **UI**: No major UI changes needed (DM approval workflow stays the same)

---

## 🔧 Implementation Plan

### Phase 1: Update Type Definitions
**File**: `lib/types.ts`

1. Update `ScrapedDataEntry` interface:
   - Make Company, Role, Headline, About optional (or remove if not needed)
   - Make Engagement Type and Comment Text optional
   - Keep only required fields: LinkedIn Post User, Linkedin Post, First Name, Last Name, Profile URL

2. Keep `DMEntry` as is (no changes expected)

3. Update `DashboardStats` if needed:
   - Company/Role stats may not be available from scraped data
   - These might come from Combined Leads instead

---

### Phase 2: Update Data Fetching
**File**: `lib/google-sheets.ts`

1. **Update `fetchScrapedDataSheet`**:
   - Remove requirements for Company, Role, Headline, About, Engagement Type
   - Only require: LinkedIn Post User, Linkedin Post, First Name, Last Name, Profile URL
   - Handle sheet names in format `Post_Nov_13_2025_11_17_PM`
   - Update detection logic to be less strict about required columns
   - Make parsing more lenient - only extract fields that exist

2. **Update `fetchAllDMData`**:
   - Primary strategy: Fetch from "Combined Leads" sheet by name
   - Fallback: Keep existing logic as backup
   - Update sheet name detection to prioritize "Combined Leads"

3. **Update `calculateStats`**:
   - Handle missing Company/Role in scraped data
   - These stats might need to come from Combined Leads instead
   - Make engagement type counting optional (may not exist in new format)

4. **Update `generateAnalyticsData`**:
   - Handle missing engagement type data
   - Handle missing company/role distribution

---

### Phase 3: Update UI Components
**File**: `components/DashboardClient.tsx`

1. **Scraped Data View**:
   - Remove Company, Role, Headline, About columns from table
   - Remove Engagement Type column and badges
   - Update post selector cards to not show company/role stats
   - Remove Company/Role filters from advanced filters
   - Update Results Summary to not show company/role breakdowns
   - Keep: Post, Name, Profile URL columns

2. **Overview Stats Cards**:
   - Update to handle missing company/role stats gracefully
   - Show "N/A" or hide if data not available

3. **Analytics View**:
   - Update pie charts to handle missing engagement type data
   - Update company/role distribution charts (may need to fetch from Combined Leads)

4. **DM View**:
   - No major changes (should work as-is)

---

### Phase 4: Handle Data Migration Gracefully

1. **Backward Compatibility**:
   - Keep old parsing logic as fallback
   - Check if fields exist before using them
   - Don't break if old format sheets still exist

2. **Error Handling**:
   - Show friendly messages if data format is unexpected
   - Log warnings when expected fields are missing

---

## 📝 Detailed File Changes

### `lib/types.ts`
```typescript
// ScrapedDataEntry - Make most fields optional
export interface ScrapedDataEntry {
  rowId: number;
  'LinkedIn Post User'?: string;
  'Linkedin Post': string;
  'First Name': string;
  'Last Name': string;
  'Profile URL': string;
  // Optional fields (may not exist in new format)
  Company?: string;
  Role?: string;
  Headline?: string;
  About?: string;
  'Engagement Type'?: 'Liked' | 'Commented';
  'Comment Text'?: string;
  post_topic?: string;
  post_gid?: number;
}
```

### `lib/google-sheets.ts`
- Update `fetchScrapedDataSheet` to only require core fields
- Update `fetchAllDMData` to fetch from "Combined Leads" sheet
- Update stats calculations to handle optional fields

### `components/DashboardClient.tsx`
- Remove columns and filters for Company, Role, Engagement Type from scraped data view
- Update analytics to work with optional fields
- Keep DM view unchanged

---

## ✅ Testing Checklist

1. ✅ Verify Index sheet still works (should be unchanged)
2. ✅ Test fetching scraped data with new reduced fields format
3. ✅ Test fetching from "Combined Leads" sheet
4. ✅ Verify UI doesn't break with missing fields
5. ✅ Test filters still work (those that remain)
6. ✅ Verify analytics charts work with optional data
7. ✅ Test DM approval workflow (should be unchanged)

---

## 🎯 Success Criteria

1. Dashboard loads without errors with new data structure
2. Scraped data table shows only available columns
3. "Combined Leads" sheet is fetched correctly for DM data
4. Analytics work gracefully with missing data
5. No breaking changes to existing functionality

---

## 📌 Notes

- Sheet name format: `Post_Nov_13_2025_11_17_PM` (runtime generated)
- Exact sheet name for DM data: "Combined Leads" (case-sensitive match needed)
- Backward compatibility: Old format sheets should still work if they exist

