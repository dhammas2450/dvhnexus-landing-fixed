# DVH Nexus Landing Page - Deployment Guide

## What's Fixed

All three landing page versions now properly handle form submissions:

1. **index.html** - Main version (Bold style)
2. **version-a-bold.html** - Bold & High-Energy style
3. **version-c-minimal.html** - Minimalist style
4. **welcome.html** - Thank you page (shown after form submit)

## The Problem That Was Fixed

The original forms had issues:
- GlobalControl API calls were failing
- Tags couldn't be applied during contact creation (must be done separately)
- API key was exposed in client-side code
- Form `action` attributes conflicted with JavaScript handlers

## The Solution

Forms now submit to `/api/submit` which is a serverless function that:
1. Creates the contact in GlobalControl
2. Fires tags separately (after contact is created)
3. Returns success to the user
4. User gets redirected to `welcome.html`

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Set environment variables:**
   ```bash
   vercel env add GC_API_KEY
   # Enter your GlobalControl API key
   
   vercel env add GC_TAG_ESCAPE
   # Enter your "escape-plan" tag ID from GlobalControl
   
   vercel env add GC_TAG_WALMART
   # Enter your "walmart" tag ID
   
   vercel env add GC_TAG_LEAD
   # Enter your "lead-magnet" tag ID
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. Deploy the folder to Netlify
2. Add environment variables in Site Settings → Environment Variables
3. Netlify will auto-detect the serverless function in `/api/submit.js`

### Option 3: Formspree (Quick & Easy - No Serverless Function Needed)

If you don't want to set up the serverless function, use Formspree:

1. Sign up at https://formspree.io
2. Create a new form
3. Replace the form action in each HTML file:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Set up Formspree to forward to GlobalControl via Zapier or webhook

## Getting Your GlobalControl Tag IDs

1. Log into GlobalControl dashboard
2. Go to **Tags** section
3. Create these tags if they don't exist:
   - `3-shift-escape-plan`
   - `walmart-escape`
   - `lead-magnet`
4. Click on each tag to get its ID (looks like `tag_abc123xyz`)

## Testing

1. Deploy the site
2. Fill out the form with test data
3. Check GlobalControl dashboard for new contact
4. Verify tags were applied
5. Check that welcome page loads

## File Structure

```
dvhnexus-landing-options/
├── index.html              # Main landing page
├── version-a-bold.html     # Bold style variant
├── version-c-minimal.html  # Minimal style variant
├── welcome.html            # Thank you page
├── api/
│   └── submit.js           # Serverless function (Vercel/Netlify)
├── logo.jpg                # Your logo (add this)
├── donald.jpg              # Your photo (add this)
└── DEPLOY.md               # This file
```

## Troubleshooting

**Form submits but no contact in GlobalControl:**
- Check browser console for errors
- Verify GC_API_KEY environment variable is set
- Check Vercel/Netlify function logs

**Tags not applying:**
- Verify tag IDs are correct in environment variables
- Check that tags exist in GlobalControl dashboard

**Welcome page not loading:**
- Ensure welcome.html is in the same directory
- Check that redirect URL is correct

## Next Steps

1. Add your `logo.jpg` and `donald.jpg` images
2. Deploy to Vercel/Netlify
3. Set environment variables
4. Test the full flow
5. Connect your domain
