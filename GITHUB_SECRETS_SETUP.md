# Setting Up GitHub Secrets for GitHub Actions

Since the `.env` file is gitignored and not committed to the repository, GitHub Actions workflows need to access your credentials through GitHub Secrets.

## How to Add Secrets to GitHub

1. **Navigate to your repository on GitHub**
   - Go to your repository page

2. **Open Settings**
   - Click on the **Settings** tab at the top of your repository

3. **Go to Secrets and variables**
   - In the left sidebar, click on **Secrets and variables** → **Actions**

4. **Add Repository Secrets**
   - Click the **New repository secret** button
   - Add the following secrets:

   **Secret 1:**
   - **Name:** `EMAIL`
   - **Value:** `behradbakh@gmail.com`

   **Secret 2:**
   - **Name:** `PASSWORD`
   - **Value:** `K9Yp52wMvSr!z$V`

5. **Save the secrets**
   - Click **Add secret** for each one

## How It Works

The GitHub Actions workflow (`scheduled-run.yml`) will:
1. Create a `.env` file during the workflow run
2. Populate it with values from GitHub Secrets
3. Your automation script will read from this `.env` file using `dotenv`

## Security Notes

- ✅ Secrets are encrypted and only visible to repository administrators
- ✅ Secrets are masked in workflow logs (they won't appear in output)
- ✅ Secrets are only available to workflows running in your repository
- ✅ Never commit secrets directly in code or workflow files

## Testing

After adding the secrets, you can test the workflow by:
1. Going to the **Actions** tab in your repository
2. Selecting the **Scheduled Automation** workflow
3. Clicking **Run workflow** → **Run workflow** (manual trigger)

