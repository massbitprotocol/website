We have two branches
- Staging: deployment to staging.massbit.io with Vercel
- Main: deployment to massbit.io with Firebase Hosting

Steps:
- Create a PR & merge to staging branch first
- Review staging.massbit.io
- Manually change the href link to match production environment
- Re-enable Google Analytic in index.html