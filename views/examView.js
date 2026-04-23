(function () {
    const modulesTableBody = document.getElementById("modulesTableBody");
    const moduleSelect = document.getElementById("moduleSelect");
    const startBtn = document.getElementById("startBtn");

    const examSection = document.getElementById("examSection");
    const resultSection = document.getElementById("resultSection");
    const moduleBadge = document.getElementById("moduleBadge");
    const progressBadge = document.getElementById("progressBadge");
    const timerLabel = document.getElementById("timerLabel");

    const questionType = document.getElementById("questionType");
    const questionTitle = document.getElementById("questionTitle");
    const questionBody = document.getElementById("questionBody");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resumeBtn = document.getElementById("resumeBtn");
    const finishBtn = document.getElementById("finishBtn");
    const hintBtn = document.getElementById("hintBtn");
    const explainBtn = document.getElementById("explainBtn");
    const solutionBtn = document.getElementById("solutionBtn");
    const hintText = document.getElementById("hintText");
    const solutionBox = document.getElementById("solutionBox");
    const checklistBox = document.getElementById("checklistBox");
    const codeCoachBox = document.getElementById("codeCoachBox");
    const lineByLineBox = document.getElementById("lineByLineBox");

    const scoreLine = document.getElementById("scoreLine");
    const timeLine = document.getElementById("timeLine");
    const feedbackList = document.getElementById("feedbackList");
    const sideModule = document.getElementById("sideModule");
    const sideQuestionType = document.getElementById("sideQuestionType");
    const sideSteps = document.getElementById("sideSteps");
    const sideConcept = document.getElementById("sideConcept");
    const sideAdhoc = document.getElementById("sideAdhoc");
    const sideLineByLine = document.getElementById("sideLineByLine");
    const helpLevelSelect = document.getElementById("helpLevelSelect");
    const sideMetrics = document.getElementById("sideMetrics");

    globalThis.AppView = {
        modulesTableBody,
        moduleSelect,
        startBtn,
        examSection,
        resultSection,
        moduleBadge,
        progressBadge,
        timerLabel,
        questionType,
        questionTitle,
        questionBody,
        prevBtn,
        nextBtn,
        pauseBtn,
        resumeBtn,
        finishBtn,
        hintBtn,
        explainBtn,
        solutionBtn,
        hintText,
        solutionBox,
        checklistBox,
        codeCoachBox,
        lineByLineBox,
        scoreLine,
        timeLine,
        feedbackList,
        sideModule,
        sideQuestionType,
        sideSteps,
        sideConcept,
        sideAdhoc,
        sideLineByLine,
        helpLevelSelect,
        sideMetrics
    };
})();
