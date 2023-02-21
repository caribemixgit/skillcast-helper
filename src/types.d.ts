declare namespace SkillCast {
    interface Frame extends Window {
        thisPageNo: number;
        getQuestionAnswerJSON: (id: string, question: Question) => {
            success: (callback: (questionAnswerJSON: { correct: (0 | 1)[] }) => void) => void;
        };
        SKILLCASTSCROLLINGAPI: {
            showNextOrContinue: () => void;
        };
    }
    interface QuestionFrame extends Frame {
        aQb: { [key: string]: string };
        question: Question;
    }
    interface QuestionArrayWindow extends Frame {
        questionBankArray: QuestionBank[];
    }

    export interface Option {
        content: string;
        s: number;
        width: string;
        id: string;
        c: string;
    }

    export interface Question {
        content: string;
        seqNo: number;
        objectiveId: string;
        itemSort: string;
        options: Option[];
        id: string;
        attempts: string;
        explanation: string;
        permanent: number;
    }

    export interface QuestionBank {
        seqNo: number;
        objectiveId: string;
        count: number;
        caseStudy: string;
        sort: number;
        questions: Question[];
        caseStudyWidth: number;
        id: string;
        permanent: number;
    }
}

