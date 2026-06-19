# 3-Shift Escape Plan - Deployment Guide

## ✅ What Has Been Built

### 1. Landing Page (index.html)
- **Theme:** Bold/Red (#FF3B30, #FF6B35)
- **Logo:** 90px height in header
- **Donald's Photo:** 120px circular in author section
- **Headline:** "The 3-Shift Escape Plan"
- **Subheadline:** "How I built an AI team for $40 operating costs plus internet/phone while working day shifts at Walmart — and how you can escape too."
- **Author Section:** "Donald Hammas - 3-Year Walmart Associate → Walking away July 22, 2026"
- **4 Benefit Bullets:** With checkmarks
- **Form:** First Name, Email, Submit button "SEND ME THE ESCAPE PLAN →"
- **Privacy Note:** Full security message included
- **Mobile Responsive:** Yes
- **GlobalControl Integration:** FIXED - includes email parameter in tag requests

### 2. Welcome Page (welcome.html)
- **Success Message:** Checkmark with animation
- **Headline:** "You're In! Check Your Email"
- **Spam Instructions:** Included
- **4 Next Steps:** Detailed action items
- **DVH Nexus Link:** Included
- **Theme:** Matches landing page (red/orange)
- **Mobile Responsive:** Yes

### 3. PDF Report (3-shift-escape-plan.html)
- **Mobile Responsive HTML:** Can be printed to PDF
- **Theme:** Red/orange matching landing page
- **Cover Page:** Included
- **Donald's Story:** Full author bio
- **AI Team Costs Breakdown:** Detailed
- **3 Shifts with Action Steps:** Complete
- **Reality Check:** Important disclaimers
- **Next Steps:** Clear action items
- **Future Tense:** "I will walk away July 22, 2026"

### 4. Upsell Video Course Page (course.html)
- **Price Point:** $47
- **5 Course Modules:** Detailed breakdown
- **4 Fast-Action Bonuses:** Listed
- **30-Day Guarantee:** Included
- **Video Placeholder:** Ready for actual video
- **Theme:** Matches landing page
- **Mobile Responsive:** Yes

### 5. API Handler (api/submit.js)
- **FIXED GlobalControl Integration:** Now includes email parameter when firing tags
- **Contact Creation:** Creates or finds existing contact
- **Tag Firing:** Applies all 3 tags with proper payload
- **Error Handling:** Graceful fallbacks
- **CORS Enabled:** For cross-origin requests

### 6. Configuration Files
- **vercel.json:** Vercel deployment configuration
- **.vercel/project.json:** Project linking (from existing project)

## 🔧 Environment Variables Required

Set these in your Vercel dashboard:

```
GC_API_KEY=905cceefcb95fb7c2cce20629f8ba63609dc6b70c3244aab5385e84bde7bf04b
GC_TAG_ESCAPE=6a35811fc2b6d1efefb25daf
GC_TAG_WALMART=6a358122c2b6d1efefb25e9c
GC_TAG_LEAD=6a35812ac2b6d1efefb26dab
```

## 🚀 Deployment Steps

### Step 1: Login to Vercel
```bash
cd ~/.openclaw/workspace/3shift-escape-plan
vercel login
# Follow the prompts to authenticate
```

### Step 2: Link to Project
```bash
vercel link
# Select "dvhnexus-landing-options" project
```

### Step 3: Set Environment Variables
```bash
vercel env add GC_API_KEY
# Enter: 905cceefcb95fb7c2cce20629f8ba63609dc6b70c3244aab5385e84bde7bf04b

vercel env add GC_TAG_ESCAPE
# Enter: 6a35811fc2b6d1efefb25daf

vercel env add GC_TAG_WALMART
# Enter: 6a358122c2b6d1efefb25e9c

vercel env add GC_TAG_LEAD
# Enter: 6a35812ac2b6d1efefb26dab
```

### Step 4: Deploy
```bash
vercel --prod
```

## 🧪 Testing Checklist

After deployment, test:

1. **Landing Page Load:** Visit the deployed URL
2. **Form Submission:**
   - Enter test name and email
   - Submit form
   - Should redirect to welcome.html
3. **GlobalControl Integration:**
   - Check GlobalControl dashboard for new contact
   - Verify contact has all 3 tags applied:
     - 3-shift-escape-plan
     - walmart-escape
     - lead-magnet
4. **Welcome Page:**
   - Check that it displays correctly
   - Verify all links work
5. **PDF Report:**
   - Visit /3-shift-escape-plan.html
   - Print to PDF to verify formatting
6. **Course Page:**
   - Visit /course.html
   - Verify all content displays correctly

## 📁 File Structure

```
3shift-escape-plan/
├── index.html                  # Landing page
├── welcome.html                # Thank you page
├── 3-shift-escape-plan.html    # PDF report (HTML version)
├── course.html                 # Upsell course page
├── logo.jpg                    # DVH Nexus logo
├── donald.jpg                  # Donald's photo
├── vercel.json                 # Vercel config
├── api/
│   └── submit.js               # GlobalControl integration (FIXED)
├── .vercel/
│   └── project.json            # Vercel project link
└── DEPLOYMENT-GUIDE.md         # This file
```

## 🐛 What Was Fixed From Yesterday

### The Bug:
Yesterday's GlobalControl integration was NOT including the `email` parameter when firing tags. The API requires BOTH `contactId` AND `email` in the tag firing request.

### The Fix:
```javascript
// OLD (broken):
body: JSON.stringify({ contactId: contactId })

// NEW (fixed):
body: JSON.stringify({ 
  contactId: contactId,
  email: email  // This was missing!
})
```

This is now implemented in `api/submit.js`.

## 📧 URLs After Deployment

- **Landing Page:** https://dvhnexus-landing-options.vercel.app/
- **Welcome Page:** https://dvhnexus-landing-options.vercel.app/welcome.html
- **PDF Report:** https://dvhnexus-landing-options.vercel.app/3-shift-escape-plan.html
- **Course Page:** https://dvhnexus-landing-options.vercel.app/course.html

## 📝 Next Steps After Deployment

1. **Test the form** with a real email
2. **Check GlobalControl** for the contact and tags
3. **Set up email automation** in GlobalControl for the lead magnet delivery
4. **Connect custom domain** if desired
5. **Add actual video** to course.html when ready
6. **Set up payment processing** for the $47 course (PayPal/Stripe)

---

**Built by:** Atlas (AI Assistant)  
**For:** Donald Hammas / DVH Nexus  
**Date:** June 19, 2026  
**Status:** Ready for deployment