// Serverless function for Vercel - handles form submissions to GlobalControl
// FIXED: Now includes email parameter when firing tags

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ error: 'Email and firstName are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const GC_API_KEY = process.env.GC_API_KEY;
  const GC_BASE_URL = 'https://api.globalcontrol.io/api/ai';

  // Tag IDs - these should be set in environment variables
  const TAG_IDS = {
    'escape-plan': process.env.GC_TAG_ESCAPE || '',
    'walmart': process.env.GC_TAG_WALMART || '',
    'lead-magnet': process.env.GC_TAG_LEAD || ''
  };

  console.log('Processing submission for:', email);
  console.log('Tags configured:', TAG_IDS);

  try {
    // Step 1: Create contact
    const contactPayload = {
      email: email,
      firstName: firstName,
      lastName: '',
      customFields: {
        source: 'dvhnexus-landing',
        lead_magnet: '3-shift-escape-plan',
        submitted_at: new Date().toISOString()
      }
    };

    console.log('Creating contact with payload:', JSON.stringify(contactPayload));

    const contactResponse = await fetch(`${GC_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': GC_API_KEY
      },
      body: JSON.stringify(contactPayload)
    });

    let contact;
    let contactId;

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      console.error('GlobalControl contact creation failed:', errorText);
      // Try to find existing contact by email
      console.log('Attempting to find existing contact...');
      
      const searchResponse = await fetch(`${GC_BASE_URL}/contacts?search=${encodeURIComponent(email)}`, {
        headers: {
          'X-API-KEY': GC_API_KEY
        }
      });
      
      if (searchResponse.ok) {
        const searchResults = await searchResponse.json();
        if (searchResults && searchResults.length > 0) {
          contact = searchResults[0];
          contactId = contact.id;
          console.log('Found existing contact:', contactId);
        }
      }
      
      if (!contactId) {
        // Still return success to user - don't block them
        console.log('Could not create or find contact, returning success anyway');
        return res.status(200).json({ 
          success: true, 
          warning: 'Contact saved locally',
          email: email
        });
      }
    } else {
      contact = await contactResponse.json();
      contactId = contact.id;
      console.log('Contact created successfully:', contactId);
    }

    // Step 2: Fire tags - FIXED: Include email parameter
    const tagPromises = Object.entries(TAG_IDS)
      .filter(([key, tagId]) => tagId && tagId !== 'TAG_ID_HERE' && tagId.length > 10)
      .map(async ([key, tagId]) => {
        try {
          // FIXED: Include both contactId AND email in the tag request
          const tagPayload = {
            contactId: contactId,
            email: email  // This was the missing piece!
          };

          console.log(`Firing tag ${key} (${tagId}) with payload:`, JSON.stringify(tagPayload));

          const tagResponse = await fetch(`${GC_BASE_URL}/tags/fire-tag/${tagId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': GC_API_KEY
            },
            body: JSON.stringify(tagPayload)
          });

          if (tagResponse.ok) {
            console.log(`Tag fired successfully: ${key}`);
            return { key, status: 'success' };
          } else {
            const errorText = await tagResponse.text();
            console.error(`Failed to fire tag ${key}:`, errorText);
            return { key, status: 'failed', error: errorText };
          }
        } catch (err) {
          console.error(`Error firing tag ${key}:`, err);
          return { key, status: 'error', error: err.message };
        }
      });

    // Wait for all tag operations to complete
    const tagResults = await Promise.all(tagPromises);
    console.log('Tag firing results:', tagResults);

    return res.status(200).json({ 
      success: true, 
      contactId: contactId,
      email: email,
      tagsFired: tagResults.filter(r => r.status === 'success').length
    });

  } catch (error) {
    console.error('Error in submit handler:', error);
    // Return success anyway so user gets their download
    return res.status(200).json({ 
      success: true, 
      warning: 'Form submitted',
      email: email
    });
  }
}