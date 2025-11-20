# Step-by-Step Workflow & Instructions for Google Store

**Phase 1** Account Setup

1. Create the Google Play Developer Account. Go to the Google Play Console: https://play.google.com/console/u/0/signup
2. Sign in with the primary Google Account you want to own the app. This account will be the permanent owner.
3. Pay the one-time $25 registration fee. This is mandatory and only one time life.
4. Complete the account setup, including providing name, contact info, and agreeing to the distribution agreement.
5. Add the Developer as a User:

- Once inside the Play Console, look for the menu on the left-hand side.
- Click on "Users & permissions".
- Click the "Invite new users" button.
- Enter the email address I (onier0217@gmail.com) use for my Google Account.
- Assign the correct role: This is the most important part. To give me the power to do everything except manage payments and financial details, assign me the role of Admin.

Why Admin and not Developer? An Admin can manage all app releases, store listings, and user access. A Developer role is more limited. As the main developer and manager, I need the Admin role to work efficiently on your behalf.

I will receive an email and must accept it.

**Phase 2** App Preparation & Upload (My Responsibility)
Goal: I take the Flutter app and prepare it for the Play Store.

1. I will prepare the App Bundle:
2. From our Flutter code, I will run a command to build an Android App Bundle (.aab file). This is the official format for publishing on Google Play. It's different from the .apk file we might use for direct installation during development.
3. Create the App in Play Console:
4. I will fill in the initial details and ask you for details:

- App Name: We Chess
- Default Language: English.
- App or Game: Select one. You decide here.
- Free or Paid: Select the appropriate model. In my consideration it is free.

**Phase 3**: Setting Up Testing (Our Collaborative Effort)
Goal: Create a closed testing environment to share the app with a limited group (Onier, Arkadij, and any testers) before it goes live to the public.

1. I will set up the "Testing Tracks".
2. Inside the Play Console, for the new app, I have navigate to: Release > Testing > Internal testing (or "Closed testing").
   Internal testing is the fastest track. We'll use this.
3. Create the Internal Testing Track:

- I will create a new "Internal testing" track.
- I will upload the first version of the .aab file to this track.
- I will fill in the required release details (version name, etc.).
- We can add testers. On the "Internal testing" page, there is a section for "Testers".

4. There are two ways to add testers:

- Opt-in URL: This is the easiest. The Play Console provides a unique link. We can share this link with anyone you want to be a tester. They click it, join the tester group, and can then download the app from the Play Store.
- Email list: We can create a list of tester email addresses directly in the console.

**Phase 4** The Review & Launch Process
Submit for Review:

1. Once the app bundle is uploaded and the testers are added, We will "Save" and then "Start rollout to Internal testing".
2. Pre-production: This submits the app to Google for review. This review is typically faster than a production review but follows similar guidelines.
3. Testing the App:
4. After Google approves the internal test version, the testers (everyone on the list) will receive an email or can use the opt-in URL.
5. They will be directed to the official Google Play Store page for the app, but it will be visible only to them. They can install it just like any other public app. This is the best way to test the real-world installation and update process.
6. Promoting to Production:
7. Once we all are satisfied with the app from the internal testing, you give the "Go-Live" approval.
8. I will then go to Release > Production in the Play Console.
9. I will create a new production release and promote the tested version from the Internal track to the Production track. This is the safest method as it uses the exact same binary that was approved and tested.
10. We submit the production release for review by Google. This review can take anywhere from a few hours to a few days.

DONE: Once approved, the app is LIVE to the entire world on the Play Store.
