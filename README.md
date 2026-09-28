# WhatsApp Business Platform - Laxtone Ceramic

Enterprise Meta WhatsApp Business Cloud API & Coexistence SaaS Panel.

## 🚀 Deploy to Vercel via GitHub

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit for WhatsApp Business Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and login with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Select your newly pushed GitHub repository.
4. **Build & Development Settings:**
   - Framework Preset: **Vite** (Automatically detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**.

### Step 3: Meta WhatsApp Webhook Configuration
Once your Vercel project is deployed, you will get a production URL (e.g. `https://your-project.vercel.app`).

In your **Meta App Dashboard > WhatsApp > Configuration**:
- **Callback URL:** `https://your-project.vercel.app/api/webhook/whatsapp`
- **Verify Token:** `laxtone_webhook_verify_token_2026`

Click **"Verify and save"**. It will verify instantly with a green checkmark!
Subscribe to `messages` and `message_template_status_update`.
