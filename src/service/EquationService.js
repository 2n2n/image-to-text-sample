class EquationService { 
    formatAccordionSolution(steps) { 
        return steps.map((step) => { 
            return {
                title: step.changeType,
                content: "Lorem ipsum dolor sit amet" 
            }
        })
    }
}

export default new EquationService;