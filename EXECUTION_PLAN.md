# Execution Plan - Production Readiness Fixes

## Strategy: Elegant, Minimal, Focused

**Principles:**
- Fix critical issues first (API compliance, errors)
- Extract only when used 2+ times (avoid over-abstraction)
- Keep changes minimal and focused
- Maintain backward compatibility where possible

---

## Phase 1: Core API Infrastructure (Critical)

### 1.1 Enhanced API Interceptor
**File:** `src/lib/api.ts`
- Add retry logic for 408, 500, 503 (exponential backoff, max 3)
- Add rate limit handling for 429 (with backoff)
- Keep existing error transformation
- **Approach:** Single elegant interceptor handling all cases

### 1.2 Simple Cache Utility
**File:** `src/lib/cache.ts` (new)
- In-memory Map-based cache
- TTL support
- Simple get/set interface
- **Approach:** Minimal, no external dependencies

### 1.3 Response Type Flexibility
**File:** `src/lib/api.ts`, `src/hooks/AuthProvider.tsx`
- Make signup/login handle both wrapped and direct responses
- Update AuthProvider to handle flexible response
- **Approach:** Defensive, handles both cases

---

## Phase 2: Essential Utilities (Code Cleanliness)

### 2.1 Textarea Auto-Resize Hook
**File:** `src/hooks/useAutoResizeTextarea.ts` (new)
- Extract from CommentItem + CommentSection
- **Justification:** Used 2x, simple extraction

### 2.2 Share Functionality Hook
**File:** `src/hooks/useShare.ts` (new)
- Extract from PostCard + PostPage
- **Justification:** Used 2x, eliminates duplication

### 2.3 Date Formatting Utility
**File:** `src/lib/utils.ts` (new or extend)
- Extract formatDate from PostCard
- **Justification:** Used 2x, simple utility

### 2.4 Remove Unused Code
**File:** `src/lib/api.ts`
- Remove unused `GetTopicsRequest` interface

---

## Phase 3: Input Validation (API Compliance)

### 3.1 Validation Utilities
**File:** `src/lib/validation.ts` (new)
- Username validation (3-50 chars, alphanumeric + underscore)
- Password validation (min 8 chars)
- Post title validation (5-250 chars)
- Post content validation (max 600 chars)
- Comment content validation (max 2000 chars)
- Topic name validation (1-50 chars)
- Topic description validation (max 600 chars)
- **Approach:** Simple functions, no over-engineering

### 3.2 Apply Validation to Forms
**Files:** 
- `src/components/LoginForm.tsx`
- `src/components/RegisterForm.tsx`
- `src/components/Dashboard.tsx`
- `src/app/topic/[topic_id]/page.tsx`
- `src/components/forum/CommentItem.tsx`
- `src/components/forum/CommentSection.tsx`

---

## Phase 4: Error Handling (Production Ready)

### 4.1 Error Toast Component
**File:** `src/components/ui/ErrorToast.tsx` (new)
- Simple, reusable error display
- Auto-dismiss after 5 seconds
- **Approach:** Minimal component, no heavy dependencies

### 4.2 Replace All alert() Calls
**Files:**
- `src/components/Dashboard.tsx`
- `src/components/forum/CommentItem.tsx`
- `src/components/forum/CommentSection.tsx`
- `src/app/topic/[topic_id]/page.tsx`
- `src/app/post/[post_id]/page.tsx`
- `src/components/forum/PostCard.tsx`

---

## Phase 5: Performance Optimizations

### 5.1 Add Caching to API Calls
**File:** `src/lib/api.ts`
- Cache `getTopics()` - 10 minutes
- Cache `getTopicPosts()` - 2 minutes
- Cache `getPostDetails()` - 1 minute
- Cache `getProfile()` - 5 minutes
- **Approach:** Integrate cache utility into API functions

### 5.2 Debounce Search
**File:** `src/app/topic/[topic_id]/page.tsx`
- Add 300ms debounce to search input
- **Approach:** Simple useEffect with setTimeout cleanup

### 5.3 Parallelize Independent Calls
**File:** `src/app/topic/[topic_id]/page.tsx`
- Parallelize `getTopics()` and `getTopicPosts()`
- **Approach:** Promise.all for independent calls

---

## Phase 6: Final Polish

### 6.1 Remove console.error in Production
**Files:** Multiple
- Guard console.error with NODE_ENV check
- **Approach:** Simple conditional

### 6.2 Improve Error Messages
- Ensure all errors are user-friendly
- **Approach:** Review and improve error messages

---

## Execution Order (Optimal)

1. **Phase 1** - Core API (retry, rate limit, cache, flexible responses)
2. **Phase 2** - Utilities (extract duplicates)
3. **Phase 3** - Validation (add to all forms)
4. **Phase 4** - Error handling (replace alerts)
5. **Phase 5** - Performance (caching, debounce, parallelize)
6. **Phase 6** - Polish (console guards, error messages)

---

## What We're NOT Doing (Avoiding Over-Engineering)

- ❌ Complex error tracking service (Sentry, etc.) - too heavy
- ❌ Global error boundary - not critical for MVP
- ❌ Complex form abstraction - forms are simple enough
- ❌ Request deduplication - premature optimization
- ❌ Code splitting - not needed yet
- ❌ Optimistic updates - nice-to-have, not critical
- ❌ Complex memoization - only if performance issues arise
- ❌ Input sanitization library - backend handles this

---

## Success Criteria

✅ All critical API compliance issues fixed
✅ No redundant code (>5 lines duplicated)
✅ All alert() replaced with proper UI
✅ Input validation matches backend rules
✅ Caching implemented per backend recommendations
✅ No linter or build errors
✅ Code remains maintainable and readable


