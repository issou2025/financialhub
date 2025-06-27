// Financial Calculators for Personal Finance Hub

// Calculator base class
class FinancialCalculator {
    constructor(formId, resultsId) {
        this.form = document.getElementById(formId);
        this.results = document.getElementById(resultsId);
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculate();
            });
            
            // Real-time calculation on input change
            const inputs = this.form.querySelectorAll('input[type="number"], select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (this.form.checkValidity()) {
                        this.calculate();
                    }
                });
            });
        }
    }
    
    calculate() {
        // Override in subclasses
    }
    
    displayResults(data) {
        if (!this.results) return;
        
        this.results.innerHTML = '';
        this.results.style.display = 'block';
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'calculator-results';
        
        const title = document.createElement('h3');
        title.className = 'calculator-results__title';
        title.textContent = 'Calculation Results';
        resultsContainer.appendChild(title);
        
        Object.entries(data).forEach(([label, value]) => {
            const item = document.createElement('div');
            item.className = 'calculator-results__item';
            
            const labelElement = document.createElement('span');
            labelElement.className = 'calculator-results__label';
            labelElement.textContent = label;
            
            const valueElement = document.createElement('span');
            valueElement.className = 'calculator-results__value';
            valueElement.textContent = value;
            
            item.appendChild(labelElement);
            item.appendChild(valueElement);
            resultsContainer.appendChild(item);
        });
        
        this.results.appendChild(resultsContainer);
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = parseFloat(value) || 0;
        }
        
        return data;
    }
}

// Mortgage Calculator
class MortgageCalculator extends FinancialCalculator {
    calculate() {
        const data = this.getFormData();
        const { loanAmount, interestRate, loanTerm, downPayment = 0 } = data;
        
        if (!loanAmount || !interestRate || !loanTerm) {
            return;
        }
        
        const principal = loanAmount - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        
        // Monthly payment calculation
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        // Total payment and interest
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;
        
        // Amortization schedule (first 12 months)
        const amortizationSchedule = this.calculateAmortizationSchedule(
            principal, monthlyRate, numberOfPayments, 12
        );
        
        const results = {
            'Monthly Payment': FinanceHub.formatCurrency(monthlyPayment),
            'Total Interest': FinanceHub.formatCurrency(totalInterest),
            'Total Payment': FinanceHub.formatCurrency(totalPayment),
            'Principal Amount': FinanceHub.formatCurrency(principal),
            'Interest Rate': FinanceHub.formatPercentage(interestRate),
            'Loan Term': `${loanTerm} years`
        };
        
        this.displayResults(results);
        this.displayAmortizationSchedule(amortizationSchedule);
        this.saveCalculation('mortgage', data);
    }
    
    calculateAmortizationSchedule(principal, monthlyRate, totalPayments, monthsToShow) {
        const schedule = [];
        let remainingBalance = principal;
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
            (Math.pow(1 + monthlyRate, totalPayments) - 1);
        
        for (let month = 1; month <= Math.min(monthsToShow, totalPayments); month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;
            
            schedule.push({
                month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, remainingBalance)
            });
        }
        
        return schedule;
    }
    
    displayAmortizationSchedule(schedule) {
        const scheduleContainer = document.createElement('div');
        scheduleContainer.className = 'amortization-schedule';
        scheduleContainer.innerHTML = `
            <h4>First 12 Months Amortization Schedule</h4>
            <div class="table-responsive">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Payment</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${schedule.map(row => `
                            <tr>
                                <td>${row.month}</td>
                                <td>${FinanceHub.formatCurrency(row.payment)}</td>
                                <td>${FinanceHub.formatCurrency(row.principal)}</td>
                                <td>${FinanceHub.formatCurrency(row.interest)}</td>
                                <td>${FinanceHub.formatCurrency(row.balance)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        this.results.appendChild(scheduleContainer);
    }
}

// Loan Calculator
class LoanCalculator extends FinancialCalculator {
    calculate() {
        const data = this.getFormData();
        const { loanAmount, interestRate, loanTerm, loanType = 'simple' } = data;
        
        if (!loanAmount || !interestRate || !loanTerm) {
            return;
        }
        
        let monthlyPayment, totalInterest, totalPayment;
        
        if (loanType === 'simple') {
            // Simple interest calculation
            totalInterest = loanAmount * (interestRate / 100) * loanTerm;
            totalPayment = loanAmount + totalInterest;
            monthlyPayment = totalPayment / (loanTerm * 12);
        } else {
            // Compound interest calculation (same as mortgage)
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            
            monthlyPayment = loanAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            
            totalPayment = monthlyPayment * numberOfPayments;
            totalInterest = totalPayment - loanAmount;
        }
        
        const results = {
            'Monthly Payment': FinanceHub.formatCurrency(monthlyPayment),
            'Total Interest': FinanceHub.formatCurrency(totalInterest),
            'Total Payment': FinanceHub.formatCurrency(totalPayment),
            'Principal Amount': FinanceHub.formatCurrency(loanAmount),
            'Interest Rate': FinanceHub.formatPercentage(interestRate),
            'Loan Term': `${loanTerm} years`,
            'Interest Type': loanType === 'simple' ? 'Simple Interest' : 'Compound Interest'
        };
        
        this.displayResults(results);
        this.saveCalculation('loan', data);
    }
}

// Retirement Calculator
class RetirementCalculator extends FinancialCalculator {
    calculate() {
        const data = this.getFormData();
        const {
            currentAge,
            retirementAge,
            currentSavings,
            monthlyContribution,
            expectedReturn,
            inflationRate,
            desiredIncome
        } = data;
        
        if (!currentAge || !retirementAge || !expectedReturn) {
            return;
        }
        
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyReturn = expectedReturn / 100 / 12;
        const numberOfMonths = yearsToRetirement * 12;
        
        // Future value of current savings
        const futureValueOfSavings = currentSavings * 
            Math.pow(1 + expectedReturn / 100, yearsToRetirement);
        
        // Future value of monthly contributions
        const futureValueOfContributions = monthlyContribution * 
            (Math.pow(1 + monthlyReturn, numberOfMonths) - 1) / monthlyReturn;
        
        // Total retirement savings
        const totalRetirementSavings = futureValueOfSavings + futureValueOfContributions;
        
        // Required savings calculation
        const yearsInRetirement = 30; // Assuming 30 years of retirement
        const inflationAdjustedReturn = (expectedReturn - inflationRate) / 100;
        const monthlyRetirementIncome = desiredIncome / 12;
        
        const requiredSavings = monthlyRetirementIncome * 
            (1 - Math.pow(1 + inflationAdjustedReturn / 12, -yearsInRetirement * 12)) / 
            (inflationAdjustedReturn / 12);
        
        const savingsGap = Math.max(0, requiredSavings - totalRetirementSavings);
        const monthlyShortfall = savingsGap / 
            (Math.pow(1 + monthlyReturn, numberOfMonths) - 1) * monthlyReturn;
        
        const results = {
            'Years to Retirement': yearsToRetirement,
            'Future Value of Current Savings': FinanceHub.formatCurrency(futureValueOfSavings),
            'Future Value of Contributions': FinanceHub.formatCurrency(futureValueOfContributions),
            'Total Retirement Savings': FinanceHub.formatCurrency(totalRetirementSavings),
            'Required Savings': FinanceHub.formatCurrency(requiredSavings),
            'Savings Gap': FinanceHub.formatCurrency(savingsGap),
            'Additional Monthly Contribution Needed': FinanceHub.formatCurrency(monthlyShortfall),
            'Expected Annual Return': FinanceHub.formatPercentage(expectedReturn)
        };
        
        this.displayResults(results);
        this.saveCalculation('retirement', data);
    }
}

// Budget Planner
class BudgetPlanner extends FinancialCalculator {
    calculate() {
        const data = this.getFormData();
        const {
            monthlyIncome,
            housing,
            transportation,
            food,
            utilities,
            insurance,
            entertainment,
            savings,
            other
        } = data;
        
        if (!monthlyIncome) {
            return;
        }
        
        const totalExpenses = housing + transportation + food + utilities + 
                             insurance + entertainment + savings + other;
        const remaining = monthlyIncome - totalExpenses;
        const savingsRate = (savings / monthlyIncome) * 100;
        
        const results = {
            'Monthly Income': FinanceHub.formatCurrency(monthlyIncome),
            'Total Expenses': FinanceHub.formatCurrency(totalExpenses),
            'Remaining': FinanceHub.formatCurrency(remaining),
            'Savings Rate': FinanceHub.formatPercentage(savingsRate),
            'Budget Status': remaining >= 0 ? 'On Track' : 'Over Budget'
        };
        
        this.displayResults(results);
        this.displayBudgetBreakdown(data, monthlyIncome);
        this.saveCalculation('budget', data);
    }
    
    displayBudgetBreakdown(expenses, income) {
        const breakdownContainer = document.createElement('div');
        breakdownContainer.className = 'budget-breakdown';
        breakdownContainer.innerHTML = `
            <h4>Budget Breakdown</h4>
            <div class="budget-categories">
                ${Object.entries(expenses).map(([category, amount]) => {
                    if (category === 'monthlyIncome') return '';
                    const percentage = (amount / income) * 100;
                    return `
                        <div class="budget-category">
                            <div class="budget-category__header">
                                <span class="budget-category__name">${this.formatCategoryName(category)}</span>
                                <span class="budget-category__amount">${FinanceHub.formatCurrency(amount)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-bar__fill" style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                            <span class="budget-category__percentage">${FinanceHub.formatPercentage(percentage)}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        this.results.appendChild(breakdownContainer);
    }
    
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

// Investment Calculator
class InvestmentCalculator extends FinancialCalculator {
    calculate() {
        const data = this.getFormData();
        const {
            initialInvestment,
            monthlyContribution,
            years,
            expectedReturn,
            inflationRate
        } = data;
        
        if (!initialInvestment || !years || !expectedReturn) {
            return;
        }
        
        const monthlyReturn = expectedReturn / 100 / 12;
        const numberOfMonths = years * 12;
        
        // Future value of initial investment
        const futureValueOfInitial = initialInvestment * 
            Math.pow(1 + expectedReturn / 100, years);
        
        // Future value of monthly contributions
        const futureValueOfContributions = monthlyContribution * 
            (Math.pow(1 + monthlyReturn, numberOfMonths) - 1) / monthlyReturn;
        
        // Total investment value
        const totalValue = futureValueOfInitial + futureValueOfContributions;
        
        // Inflation-adjusted value
        const inflationAdjustedValue = totalValue / 
            Math.pow(1 + inflationRate / 100, years);
        
        // Total contributions
        const totalContributions = initialInvestment + (monthlyContribution * numberOfMonths);
        
        // Total interest earned
        const totalInterest = totalValue - totalContributions;
        
        const results = {
            'Initial Investment': FinanceHub.formatCurrency(initialInvestment),
            'Total Contributions': FinanceHub.formatCurrency(totalContributions),
            'Total Interest Earned': FinanceHub.formatCurrency(totalInterest),
            'Total Investment Value': FinanceHub.formatCurrency(totalValue),
            'Inflation-Adjusted Value': FinanceHub.formatCurrency(inflationAdjustedValue),
            'Investment Period': `${years} years`,
            'Expected Annual Return': FinanceHub.formatPercentage(expectedReturn)
        };
        
        this.displayResults(results);
        this.saveCalculation('investment', data);
    }
}

// Utility Functions
function saveCalculation(type, data) {
    const calculations = FinanceHub.Storage.get('calculations', {});
    if (!calculations[type]) {
        calculations[type] = [];
    }
    
    calculations[type].push({
        ...data,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 calculations
    if (calculations[type].length > 10) {
        calculations[type] = calculations[type].slice(-10);
    }
    
    FinanceHub.Storage.set('calculations', calculations);
}

function loadCalculation(type) {
    const calculations = FinanceHub.Storage.get('calculations', {});
    return calculations[type] || [];
}

// Initialize calculators when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculators based on page
    const mortgageCalc = document.getElementById('mortgage-calculator');
    if (mortgageCalc) {
        new MortgageCalculator('mortgage-calculator', 'mortgage-results');
    }
    
    const loanCalc = document.getElementById('loan-calculator');
    if (loanCalc) {
        new LoanCalculator('loan-calculator', 'loan-results');
    }
    
    const retirementCalc = document.getElementById('retirement-calculator');
    if (retirementCalc) {
        new RetirementCalculator('retirement-calculator', 'retirement-results');
    }
    
    const budgetCalc = document.getElementById('budget-planner');
    if (budgetCalc) {
        new BudgetPlanner('budget-planner', 'budget-results');
    }
    
    const investmentCalc = document.getElementById('investment-calculator');
    if (investmentCalc) {
        new InvestmentCalculator('investment-calculator', 'investment-results');
    }
});

// Export for global use
window.FinancialCalculators = {
    MortgageCalculator,
    LoanCalculator,
    RetirementCalculator,
    BudgetPlanner,
    InvestmentCalculator,
    saveCalculation,
    loadCalculation
}; 