# SkillCast Helper

# Usage

Open a training in SkillCast. Click on the the top bar and `Show as a tab`.

Then in the menu bar, click on `View` and `Developer` and `Developer Tools`.

Then in the console, paste the code from `dist/index.js` and press enter.

Please note that some manual clicks are left for the user to avoid being detected as a bot and/or to make unintended clicks.

Then you can use the following commands in the console:
For the learning part, it simulates clicks

```javascript
    helper.startLearningAutoClick();
```
When the learning part is over
```javascript
    helper.stopLearningAutoclick();
```
For the assessment part, it **only** selects the correct answer, the `submit` and `next` buttons are left for the user to click - again, to let the user double check the answer and to avoid being detected as a bot.

```javascript
    helper.startAssessmentAutoClick();
```

When done, you can just submit the assessment and the training is done.