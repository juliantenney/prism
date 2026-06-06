# Inflation Self-Study Workbook

*Captured: EV-38M-AFTER · Sprint 38-M proof run*

## Activity 1: Understanding Inflation Measurement Methods

This activity introduces the foundational concepts of inflation measurement. You will learn how CPI and GDP Deflator differ in what they measure and why that matters for understanding inflation.

### Learner task

## Understand Inflation Measurement
- Study the concept explanations and worked example contrasting CPI and GDP Deflator.
- Explain in your own words the key differences between CPI and GDP Deflator focusing on basket composition and scope.
- Use the sample output as a guide but write your own explanation.
- Complete the verification checklist to self-assess your understanding.

### Material: M1 (text)

*Purpose:* concept elucidation

Inflation is the general rise in prices that reduces the purchasing power of money. To measure inflation, economists use different price indices that track changes in the cost of goods and services over time. Two important inflation measures are the Consumer Price Index (CPI) and the GDP Deflator.  

The **Consumer Price Index (CPI)** measures the price changes of a fixed basket of consumer goods and services. This basket represents typical purchases by households, such as food, clothing, housing, and transportation. The CPI uses a **fixed basket**, meaning the quantities of goods and services are held constant to track how prices change over time. This makes CPI focused on the consumer experience and cost of living.  

In contrast, the **GDP Deflator** measures the price changes of all goods and services produced domestically, including consumer goods, investment goods, government services, and exports, minus imports. Unlike CPI, the GDP Deflator uses a **variable basket** that changes each period to reflect current production levels. This means it captures price changes across the entire economy, not just consumer spending.  

In summary, CPI focuses on a fixed basket of consumer goods and services reflecting household consumption, while the GDP Deflator covers all domestically produced goods and services with a changing basket. These differences affect how each index measures inflation and what aspects of the economy they emphasize.

### Material: M2 (worked_example)

*Purpose:* worked thinking

**Stepwise Explanation Contrasting CPI and GDP Deflator**

1. **Define the baskets**:  
   - CPI uses a fixed basket of goods and services typically bought by consumers. For example, 10 units of food, 5 units of clothing, and 2 units of transportation services.  
   - GDP Deflator uses a basket that includes all goods and services produced domestically, such as consumer goods, machinery, government services, and exports. The quantities vary each year based on production.  

2. **Measure price changes**:  
   - CPI calculates the cost of the fixed basket in the current year and compares it to the base year. If the basket cost rises from \$100 to \$110, CPI inflation is 10%.  
   - GDP Deflator calculates the ratio of nominal GDP (current prices) to real GDP (constant prices). If nominal GDP rises from \$1,000 to \$1,100 and real GDP remains \$1,000, the GDP Deflator inflation is 10%.  

3. **Scope differences**:  
   - CPI excludes goods not typically purchased by consumers, such as industrial machinery or government services.  
   - GDP Deflator includes all goods and services produced domestically, capturing broader economic price changes.  

4. **Basket flexibility**:  
   - CPI’s fixed basket does not change quantities, so it may not reflect changes in consumer buying habits or new products.  
   - GDP Deflator’s basket changes each period, reflecting current production and consumption patterns.  

**Example**: Suppose the price of food rises sharply, but the price of machinery falls. CPI will show higher inflation because food is in the fixed basket, but GDP Deflator may show smaller inflation or even deflation if machinery prices fall enough, since it includes all goods produced.

### Material: M3 (sample_output)

*Purpose:* model answer reference

The Consumer Price Index (CPI) and the GDP Deflator both measure inflation but differ mainly in basket composition and scope. The CPI tracks price changes of a fixed basket of consumer goods and services, representing typical household spending. This fixed basket means the quantities of goods and services remain constant over time, focusing on the consumer cost of living.  

In contrast, the GDP Deflator measures price changes for all goods and services produced within the country, including consumer goods, investment goods, government services, and exports. Its basket varies each period to reflect current production levels. This broader scope means the GDP Deflator captures inflation across the entire economy, not just consumer prices.  

Because CPI uses a fixed basket, it may not account for consumers substituting cheaper goods or new products entering the market. The GDP Deflator’s variable basket adjusts for these changes but may be less focused on consumer experience. Understanding these differences helps interpret inflation figures and their implications for economic policy and household budgets.

### Material: M4 (checklist)

*Purpose:* verification

**Verification Checklist: Understanding CPI vs GDP Deflator**

- [ ] I can explain that the CPI uses a fixed basket of consumer goods and services.  
- [ ] I understand that the GDP Deflator uses a variable basket including all domestically produced goods and services.  
- [ ] I can distinguish that CPI focuses on consumer purchases, while GDP Deflator covers the whole economy.  
- [ ] I know how fixed vs variable baskets affect inflation measurement differences.  

**If any item is unchecked:**  
- Review the definitions of CPI and GDP Deflator.  
- Revisit the examples contrasting basket composition and scope.  
- Reflect on how these differences influence inflation interpretation.

### Expected output

A written explanation clearly describing the differences between CPI and GDP Deflator with reference to basket composition and scope, verified by checklist completion.

---

## Activity 2: Applying CPI Inflation Rate Calculation

This activity develops your ability to apply the CPI inflation calculation method using weighted price changes from a fixed basket.

### Learner task

## Calculate CPI Inflation Rate
- Study the worked example showing how to calculate inflation rate from a fixed basket.
- Use the practice table to calculate the CPI inflation rate for a new set of goods and prices.
- Compare your calculation with the sample output for accuracy.
- Complete the verification checklist to confirm your calculation correctness.

### Material: M5 (worked_example)

*Purpose:* worked thinking

**Stepwise Calculation of CPI Inflation Rate**

1. **Identify the fixed basket and weights**:  
   Suppose the basket includes:  
   - Food: weight 0.4  
   - Clothing: weight 0.3  
   - Transportation: weight 0.3  

2. **Collect price data for base and current year**:  
   | Item          | Base Year Price | Current Year Price | Price Change Ratio (Current/Base) |  
   |---------------|-----------------|--------------------|----------------------------------|  
   | Food          | \$2.00          | \$2.20             | 2.20 / 2.00 = 1.10               |  
   | Clothing      | \$5.00          | \$5.50             | 5.50 / 5.00 = 1.10               |  
   | Transportation| \$10.00         | \$11.00            | 11.00 / 10.00 = 1.10             |  

3. **Calculate weighted price changes**:  
   Multiply each price change ratio by its weight:  
   - Food: 1.10 × 0.4 = 0.44  
   - Clothing: 1.10 × 0.3 = 0.33  
   - Transportation: 1.10 × 0.3 = 0.33  

4. **Sum weighted changes to get overall CPI inflation**:  
   Total = 0.44 + 0.33 + 0.33 = 1.10  

5. **Calculate inflation rate**:  
   Inflation rate = (Total - 1) × 100% = (1.10 - 1) × 100% = 10%  

**Interpretation**: The CPI inflation rate is 10%, meaning the cost of the fixed basket increased by 10% from the base year to the current year.

### Material: M6 (sample_output)

*Purpose:* model calculation reference

**Completed CPI Inflation Rate Calculation**

| Item          | Weight | Base Year Price | Current Year Price | Price Change Ratio | Weighted Price Change |  
|---------------|--------|-----------------|--------------------|--------------------|----------------------|  
| Food          | 0.4    | \$2.00          | \$2.20             | 1.10               | 0.44                 |  
| Clothing      | 0.3    | \$5.00          | \$5.50             | 1.10               | 0.33                 |  
| Transportation| 0.3    | \$10.00         | \$11.00            | 1.10               | 0.33                 |  
| **Total**    | 1.0    |                 |                    |                    | **1.10**             |  

**Final CPI Inflation Rate** = (1.10 - 1) × 100% = 10%  

This calculation shows that the overall price level of the fixed basket increased by 10%, indicating inflation at this rate according to the CPI method.

### Material: M7 (classification_table)

*Purpose:* practice table

| Item           | Weight | Base Year Price | Current Year Price | Price Change Ratio | Weighted Price Change | Learner Calculation |  
|----------------|--------|-----------------|--------------------|--------------------|----------------------|---------------------|  
| Food           | 0.35   | \$3.00          | \$3.30             |                    |                      |                     |  
| Housing        | 0.40   | \$8.00          | \$8.40             |                    |                      |                     |  
| Entertainment  | 0.25   | \$4.00          | \$4.20             |                    |                      |                     |  
| **Total**      | 1.00   |                 |                    |                    |                      |                     |  

**Instructions:**  
- Calculate the price change ratio for each item (Current Year Price ÷ Base Year Price).  
- Multiply each price change ratio by the weight to find the weighted price change.  
- Sum the weighted price changes to find the total.  
- Calculate the CPI inflation rate as (Total - 1) × 100%.  
- Fill in the "Learner Calculation" column with your results.

### Material: M8 (checklist)

*Purpose:* verification

**Verification Checklist: CPI Inflation Rate Calculation**

- [ ] I correctly calculated the price change ratio for each item by dividing current price by base price.  
- [ ] I accurately multiplied each price change ratio by the corresponding weight.  
- [ ] I summed all weighted price changes to find the total correctly.  
- [ ] I computed the final inflation rate using (Total - 1) × 100% formula correctly.  

**If any item is unchecked:**  
- Revisit the calculation steps and check each arithmetic operation.  
- Review the concept of weighted averages in CPI calculation.  
- Practice with the worked example again before retrying.

### Expected output

Completed CPI inflation rate calculation table with correct weighted price changes and final inflation rate, verified by checklist completion.

---

## Activity 3: Analysing Inflation Impact on Household Budgets

This activity guides you through analysing how inflation differently affects households with fixed and variable incomes using multiple analytical lenses.

### Learner task

## Analyse Inflation Effects on Households
- Study the worked analytic pass illustrating inflation impact on fixed and variable income households.
- Review the Maya-style household scenarios.
- Complete the analysis table comparing the two households using distribution, adaptation, and time horizon lenses.
- Justify your ratings and classifications.
- Verify your analysis using the checklist.

### Material: M9 (worked_example)

*Purpose:* worked analytic pass

**Analysing Inflation Impact on Fixed-Income vs Variable-Income Households**

1. **Scenario Setup**:  
   - Household A: Fixed income of \$2,000/month, no inflation adjustment.  
   - Household B: Variable income starting at \$2,000/month, with potential annual inflation adjustment.  

2. **Distribution Lens**:  
   - Household A loses purchasing power as prices rise but income remains fixed. Inflation reduces real income.  
   - Household B may maintain purchasing power if income adjusts with inflation, reducing loss.  

3. **Adaptation Lens**:  
   - Household A must reduce discretionary spending or dip into savings to cope. Limited flexibility.  
   - Household B can plan for inflation adjustments, possibly maintaining spending patterns.  

4. **Time Horizon Lens**:  
   - Short-term: Household A feels immediate pressure; Household B may not.  
   - Long-term: Household A’s real income erodes steadily; Household B’s income may keep pace, preserving stability.  

5. **Conclusion**:  
   - Fixed-income households are more vulnerable to inflation’s negative effects.  
   - Variable-income households have potential protection but depend on adjustment mechanisms.  

This stepwise analysis shows how income type influences inflation impact, highlighting the need for tailored household strategies.

### Material: M10 (analysis_table)

*Purpose:* practice analysis

| Lens           | Household A (Fixed Income) | Impact Rating (Low/Med/High) | Justification | Household B (Variable Income) | Impact Rating (Low/Med/High) | Justification |  
|----------------|----------------------------|------------------------------|---------------|------------------------------|------------------------------|---------------|  
| Distribution   |                            |                              |               |                              |                              |               |  
| Adaptation     |                            |                              |               |                              |                              |               |  
| Time Horizon   |                            |                              |               |                              |                              |               |  

**Instructions:**  
- For each lens, classify the impact on each household (Fixed and Variable Income).  
- Rate the severity of impact as Low, Medium, or High.  
- Provide a brief justification for each rating based on the lens perspective.

### Material: M11 (scenario)

*Purpose:* case study

**Maya-Style Household Scenarios**

**Household A: Fixed Income**  
- Monthly income: \$2,000 (fixed, no inflation adjustment)  
- Monthly expenses: \$1,800 (food, utilities, transport, healthcare)  
- Inflation exposure: Prices rising at 5% annually  
- Savings: \$500 emergency fund  

**Household B: Variable Income**  
- Monthly income: \$2,000, adjusted annually by inflation rate  
- Monthly expenses: \$1,800, same composition as Household A  
- Inflation exposure: Prices rising at 5% annually  
- Savings: \$300 emergency fund  

These scenarios illustrate typical fixed and variable income households facing inflation pressures, providing a basis for analysis.

### Material: M12 (checklist)

*Purpose:* verification

**Verification Checklist: Inflation Impact Analysis**

- [ ] I applied the distribution lens correctly to assess purchasing power changes.  
- [ ] I considered adaptation options realistically for each household.  
- [ ] I differentiated short-term and long-term effects using the time horizon lens.  
- [ ] My justifications clearly explain the impact ratings for both households.  

**If any item is unchecked:**  
- Review the lenses definitions and their application to income types.  
- Re-examine the Maya household scenarios for relevant details.  
- Revise your analysis and justifications accordingly.

### Expected output

Completed analysis table with classifications, ratings, and justifications for inflation impact on two household types, verified by checklist completion.

---

## Activity 4: Evaluating Household Inflation Management Strategies

This capstone activity requires you to evaluate and justify household strategies for managing inflation effects using explicit criteria and trade-offs, anchored in a realistic scenario.

### Learner task

## Evaluate Household Inflation Strategies
- Review the Maya-style household scenario and neutral strategy menu.
- Study the evaluation criteria and modelling note contrasting weak and strong judgements.
- Complete the guided judgement decision table ranking strategies and noting trade-offs.
- Use the independent judgement template to write a memo recommending a strategy with justification.
- Verify your memo using the checklist.
- Complete the transfer prompt applying your evaluation to your own household or context.
- Finish by reading and reflecting on the consolidation summary.

### Material: M13 (scenario)

*Purpose:* decision context

**Maya-Style Household Inflation Strategy Scenario**

The Maya household has a fixed monthly income of \$2,000 and monthly expenses of \$1,800. Inflation is running at 5% annually, increasing the cost of essential goods and services. The household must choose from the following neutral strategies (A–E) to manage inflation effects:  

- **Strategy A:** Cut discretionary spending to preserve essential expenses.  
- **Strategy B:** Increase working hours or find additional income sources.  
- **Strategy C:** Use savings to cover increased costs temporarily.  
- **Strategy D:** Invest in inflation-protected assets to grow income.  
- **Strategy E:** Negotiate fixed-price contracts for essential services.  

No strategy is pre-ranked; the household must evaluate trade-offs and select the most suitable approach based on their situation.

### Material: M14 (text)

*Purpose:* criteria exposition

**Evaluation Criteria for Household Inflation Strategies**

When evaluating strategies to manage inflation, consider these key criteria:  

1. **Financial Stability:** Does the strategy maintain steady income and control expenses to avoid debt or financial shocks?  
2. **Purchasing Power Preservation:** How well does the strategy protect the household’s ability to buy essential goods and services despite rising prices?  
3. **Risk and Trade-Offs:** What are the potential risks, such as increased workload, reduced savings, or investment losses? Are trade-offs between short-term relief and long-term sustainability balanced?  

Using these criteria helps households make informed decisions that balance immediate needs with future security.

### Material: M15 (modelling_note)

*Purpose:* worked judgement

**Contrasting Weak vs Strong Judgements in Evaluating Inflation Strategies**

- **Weak Judgement (Slogan-style):**  
  "Strategy B is best because earning more money solves everything."  
  This judgement is simplistic, lacks criteria, and ignores risks or trade-offs. It does not explain why earning more is better than other options or consider household capacity.  

- **Strong Judgement (Criteria-led):**  
  "Strategy B is preferred because it enhances financial stability by increasing income, which helps preserve purchasing power. However, it carries risks such as increased fatigue and less time for family, which must be balanced against benefits. The household’s current health and time availability suggest this strategy is feasible but should be combined with prudent expense management to mitigate risks."  
  This judgement explicitly uses evaluation criteria, acknowledges trade-offs, and justifies the choice with reasoning about household context.  

Strong judgements provide transparent, balanced, and reasoned evaluations that support confident decision-making.

### Material: M16 (decision_table)

*Purpose:* guided judgement

| Strategy | Financial Stability (Low/Med/High) | Purchasing Power Preservation (Low/Med/High) | Risk and Trade-Offs Notes | Ranking (1=best) | Justification Hints |  
|----------|-----------------------------------|---------------------------------------------|--------------------------|------------------|--------------------|  
| A        | Medium                            | Medium                                      | May reduce quality of life; saves money |                  | Consider expense cuts impact on essentials |  
| B        | High                             | High                                        | Increased workload; potential burnout |                  | Weigh income gain vs personal cost |  
| C        | Low                              | Medium                                      | Depletes savings; unsustainable long-term |                  | Temporary relief vs future risk |  
| D        | Medium                          | High                                        | Investment risk; requires financial knowledge |                  | Long-term protection vs short-term risk |  
| E        | Medium                          | Medium                                      | May not be possible for all expenses |                  | Feasibility and contract terms |  

**Instructions:**  
- Complete the Ranking column by ordering strategies from best (1) to least suitable.  
- Add notes on trade-offs in the Risk and Trade-Offs column as needed.  
- Use Justification Hints to guide your reasoning.

### Material: M17 (template)

*Purpose:* independent judgement

**Independent Judgement Memo Template: Household Inflation Strategy Evaluation**

**To:** [Household Decision Maker]  
**From:** [Your Name]  
**Date:** [Date]  
**Subject:** Recommendation on Inflation Management Strategy  

**1. Introduction**  
Briefly describe the household’s inflation challenge and the need for a strategy.  

**2. Evaluation Criteria**  
Outline the criteria used to evaluate strategies: financial stability, purchasing power preservation, and risk/trade-offs.  

**3. Strategy Comparison**  
Summarize the main strengths and weaknesses of the considered strategies (A–E).  

**4. Recommended Strategy**  
State your recommended strategy and explain why it ranks highest based on the criteria.  

**5. Justification and Trade-Offs**  
Discuss the trade-offs involved and how the household can manage risks associated with the chosen strategy.  

**6. Conclusion**  
Provide a closing statement reinforcing the recommendation and next steps.  

**Word Band (Use these phrases to help structure your memo):**  
- "The household faces rising costs due to inflation..."  
- "Financial stability is critical because..."  
- "Strategy [X] offers advantages such as..."  
- "However, it involves risks including..."  
- "Balancing these factors, the recommended approach is..."  
- "To mitigate risks, the household should consider..."

### Material: M18 (checklist)

*Purpose:* verification

**Verification Checklist: Inflation Strategy Evaluation Memo**

- [ ] My memo includes a clear introduction describing the inflation challenge.  
- [ ] I explicitly state and explain the evaluation criteria used.  
- [ ] I compare strategies with reference to the criteria and trade-offs.  
- [ ] I provide a justified recommendation with balanced reasoning.  
- [ ] I discuss potential risks and how to manage them.  
- [ ] The memo is structured logically and clearly.  

**If any item is unchecked:**  
- Review your memo sections and add missing elements.  
- Ensure reasoning uses the evaluation criteria explicitly.  
- Clarify trade-offs and justification.

### Material: M19 (transfer_prompt)

*Purpose:* transfer

**Transfer Task: Applying Inflation Strategy Evaluation to Your Own Household**

Reflect on your own household or personal financial situation. Using the evaluation criteria of financial stability, purchasing power preservation, and risk/trade-offs:  

- Describe the inflation challenges your household faces or might face.  
- Identify which strategies from the Maya scenario or others you consider relevant.  
- Explain which strategy you would recommend and why, using explicit criteria and acknowledging trade-offs.  
- Discuss how you would manage any risks associated with your chosen strategy.  

Write at least 80 words to clearly articulate your evaluation and reasoning. This exercise helps you apply learned concepts to real-life decisions.

### Material: M20 (consolidation_summary)

*Purpose:* session closure

In this session, you explored how households can manage the effects of inflation through different strategies. Key ideas include understanding the importance of financial stability, preserving purchasing power, and carefully weighing risks and trade-offs. Evaluating strategies requires balancing immediate needs with long-term security, recognizing that no single approach fits all households. Reflect on how criteria-led evaluation strengthens decision-making by providing clear justification and transparency. As you apply these concepts to your own context, consider how your household’s unique circumstances influence the best strategy choice. Use these insights to build resilient financial plans that adapt to inflation challenges.

### Expected output

Completed decision table with rankings and trade-offs; an independent judgement memo recommending a household inflation strategy with explicit criteria-based justification; completed verification checklist; transfer response applying evaluation to own context.

---

## Composed page sections (reference)

### Session Overview and Learning Purpose

This workbook guides you through understanding inflation measurement, calculating inflation rates, analysing inflation's impact on household budgets, and evaluating strategies to manage inflation effects. You will explore key concepts such as the Consumer Price Index (CPI) and GDP Deflator, apply calculation methods, and critically evaluate household strategies using explicit criteria and trade-offs. The session is designed for a standard study duration of 30 to 120 minutes and focuses on the Maya household scenario to anchor your learning.

### Learning Outcomes

By completing this workbook, you will be able to:

1. Explain the difference between the Consumer Price Index (CPI) and the GDP Deflator in terms of basket composition and scope of goods and services measured.
2. Calculate the inflation rate using price changes from a fixed basket of goods and services as measured by the CPI.
3. Analyse how inflation affects different household budgets, including fixed-income and variable-income scenarios.
4. Evaluate strategies households can use to manage the effects of inflation on their finances, defending a justified choice using explicit criteria and trade-offs.

### Pre-Activity Context and Study Tips

Recall your prior knowledge of inflation and price indices to connect with new distinctions. Focus on conceptual contrasts and implications for inflation measurement, and apply analytical lenses systematically to compare household impacts. Use the scaffold hints provided in each activity to guide your reasoning. Reflect on trade-offs and criteria when evaluating household strategies. This workbook includes worked examples, practice tables, checklists, and scenarios to support your learning.

### Learning Activities

[
  {
    "title": "Understanding Inflation Measurement Methods",
    "duration_minutes": 15,
    "learner_task": "## Understand Inflation Measurement\n- Study the concept explanations and worked example contrasting CPI and GDP Deflator.\n- Explain in your own words the key differences between CPI and GDP Deflator focusing on basket composition and scope.\n- Use the sample output as a guide but write your own explanation.\n- Complete the verification checklist to self-assess your understanding.",
    "expected_output": "A written explanation clearly describing the differences between CPI and GDP Deflator with reference to basket composition and scope, verified by checklist completion.",
    "materials": {
      "concept_text": "Inflation is the general rise in prices that reduces the purchasing power of money. To measure inflation, economists use different price indices that track changes in the cost of goods and services over time. Two important inflation measures are the Consumer Price Index (CPI) and the GDP Deflator.\n\nThe **Consumer Price Index (CPI)** measures the price changes of a fixed basket of consumer goods and services. This basket represents typical purchases by households, such as food, clothing, housing, and transportation. The CPI uses a **fixed basket**, meaning the quantities of goods and services are held constant to track how prices change over time. This makes CPI focused on the consumer experience and cost of living.\n\nIn contrast, the **GDP Deflator** measures the price changes of all goods and services produced domestically, including consumer goods, investment goods, government services, and exports, minus imports. Unlike CPI, the GDP Deflator uses a **variable basket** that changes each period to reflect current production levels. This means it captures price changes across the entire economy, not just consumer spending.\n\nIn summary, CPI focuses on a fixed basket of consumer goods and services reflecting household consumption, while the GDP Deflator covers all domestically produced goods and services with a changing basket. These differences affect how each index measures inflation and what aspects of the economy they emphasize.",
      "worked_example": "**Stepwise Explanation Contrasting CPI and GDP Deflator**\n\n1. **Define the baskets**:  \n   - CPI uses a fixed basket of goods and services typically bought by consumers. For example, 10 units of food, 5 units of clothing, and 2 units of transportation services.  \n   - GDP Deflator uses a basket that includes all goods and services produced domestically, such as consumer goods, machinery, government services, and exports. The quantities vary each year based on production.  \n\n2. **Measure price changes**:  \n   - CPI calculates the cost of the fixed basket in the current year and compares it to the base year. If the basket cost rises from \\$100 to \\$110, CPI inflation is 10%.  \n   - GDP Deflator calculates the ratio of nominal GDP (current prices) to real GDP (constant prices). If nominal GDP rises from \\$1,000 to \\$1,100 and real GDP remains \\$1,000, the GDP Deflator inflation is 10%.  \n\n3. **Scope differences**:  \n   - CPI excludes goods not typically purchased by consumers, such as industrial machinery or government services.  \n   - GDP Deflator includes all goods and services produced domestically, capturing broader economic price changes.  \n\n4. **Basket flexibility**:  \n   - CPI’s fixed basket does not change quantities, so it may not reflect changes in consumer buying habits or new products.  \n   - GDP Deflator’s basket changes each period, reflecting current production and consumption patterns.  \n\n**Example**: Suppose the price of food rises sharply, but the price of machinery falls. CPI will show higher inflation because food is in the fixed basket, but GDP Deflator may show smaller inflation or even deflation if machinery prices fall enough, since it includes all goods produced.",
      "sample_output": "The Consumer
