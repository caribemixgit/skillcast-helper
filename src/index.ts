class SkillCastHelper {
    private _autoClickInterval: NodeJS.Timer;

    get motherFrame() {
        return document?.querySelector('#scorm_frame') as HTMLIFrameElement;
    }
    get iframe() {
        return this.motherFrame?.contentDocument?.querySelector('#scr_frame') as HTMLIFrameElement;
    }
    get iframeContentWindow() {
        return this.iframe?.contentWindow;
    }
    set autoClickInterval(interval) {
        this._autoClickInterval = interval;
    }
    get autoClickInterval() {
        return this._autoClickInterval;
    }
    autoClickNextLearning() {
        const contentWindow = this.iframe?.contentWindow as SkillCast.Frame;
        contentWindow?.SKILLCASTSCROLLINGAPI?.showNextOrContinue?.();
        const buttonNext = (contentWindow.document.querySelector(`#nextButtonBot`) || contentWindow.document.querySelector(`#continueButton`)) as HTMLElement;
        buttonNext?.click();
        if (!buttonNext) {
            console.log('No next button found');
        }
    }
    startLearningAutoClick() {
        const TIMEOUT = 1000;
        const interval = setInterval(() => {
            this.autoClickNextLearning();
        }, TIMEOUT);
        this.autoClickInterval = interval;
    }
    stopLearningAutoclick() {
        clearInterval(this.autoClickInterval);
    }
    async getCurrentQuestionCorrectOptionIds(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const { contentWindow } = this.iframe;
            const scrmWindow = contentWindow as SkillCast.QuestionFrame;
            if (scrmWindow.aQb) {
                const { question, getQuestionAnswerJSON } = scrmWindow;
                getQuestionAnswerJSON(question.id, question).success((questionAnswerJSON) => {
                    const options: (0 | 1)[] = questionAnswerJSON.correct;
                    console.log({ options })
                    const optionsWithCorrectAnswer = options.filter((option) => option === 1);
                    console.log({ optionsWithCorrectAnswer });
                    if (optionsWithCorrectAnswer.length === 0) {
                        reject(new Error('Correct option not found'));
                    }
                    // @ts-ignore
                    const correctOptionIds = optionsWithCorrectAnswer.map(option => option.id);
                    console.log({ correctOptionIds });
                    resolve(correctOptionIds);
                });
            } else {
                const questionBankWindow = contentWindow as SkillCast.QuestionArrayWindow;
                const questionBankArray = questionBankWindow.questionBankArray;
                const allQuestions = questionBankArray.reduce((acc, questionBank) => {
                    return [...acc, ...questionBank.questions];
                }, []) as SkillCast.Question[];
                console.log({ allQuestions });
                const assessmentQuestionElement = this.iframe.contentWindow.document.querySelector('.assessment-question');
                console.log(assessmentQuestionElement);
                if (!assessmentQuestionElement) {
                    reject(new Error('Question not found'));
                }
                const currentAssessmentQuestionText = assessmentQuestionElement.innerHTML;
                console.log({ currentAssessmentQuestionText });
                const questionIndex = allQuestions.findIndex((question) => question.content.includes(currentAssessmentQuestionText));
                console.log({ questionIndex });
                if (questionIndex === -1) {
                    reject(new Error('Question not found'));
                }
                const question = allQuestions[questionIndex];
                console.log({ question });
                const correctOptions = question.options.filter(
                    (option) => option.c === "1"
                );
                console.log({ correctOptions });
                if (correctOptions.length === 0) {
                    reject(new Error("Correct option not found"));
                }
                const correctOptionIds = correctOptions.map((option) => option.id);
                console.log({ correctOptionIds });
                resolve(correctOptionIds);
            }
        });
    }
    async selectCurrentQuestionAnswer() {
        const correctOptionIds = await this.getCurrentQuestionCorrectOptionIds();
        correctOptionIds.forEach((id) => {
            const correctOption = this.iframe.contentWindow.document.querySelector(`#${id}`) as HTMLInputElement;
            const isAlreadyChecked = correctOption.checked;
            if (!isAlreadyChecked) {
                correctOption.click();
            }
        });
    }
    async startAssessmentAutoClick() {
        const interval = setInterval(async () => {
            await this.selectCurrentQuestionAnswer();
        }, 1000);
        this.autoClickInterval = interval;
    }
    async stopAssessmentAutoClick() {
        clearInterval(this.autoClickInterval);
    }
}

const helper = new SkillCastHelper();
