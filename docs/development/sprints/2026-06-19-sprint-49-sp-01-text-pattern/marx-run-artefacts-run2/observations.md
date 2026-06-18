\# Marx Run 2 — Observations



\*\*Date:\*\* 2026-06-20

\*\*Sprint:\*\* Sprint 49 (closure validation)

\*\*Corpus:\*\* Marx self-directed learner-page workflow

\*\*Purpose:\*\* Record findings from the first end-to-end validation run after Sprint 49 generation, preservation, and cognition-compliance fixes.



\---



\# Summary



Marx Run 2 represents the first validation run in which:



\* DLA generation emitted mandatory cognition-orientation fields.

\* GAM generated substantive connective exposition.

\* Design Page compose largely preserved framing and materials.

\* Renderer surfaced cognition and framing structures consistently.



The run demonstrates that the primary Sprint 49 objective has been achieved:



> Pedagogic structures are no longer disappearing through the workflow.



The remaining challenge is manifestation rather than generation or preservation.



\---



\# Key Findings



\## 1. DLA cognition generation succeeded



Previous Marx runs generated:



\* activity\_preamble

\* learner\_task

\* expected\_output

\* support\_note



but omitted cognition-orientation fields.



Run 2 generated:



\* activity\_preamble

\* reasoning\_orientation

\* self\_explanation\_prompt (where appropriate)

\* prior\_knowledge\_activation (where appropriate)



across all activities.



This validates:



\* LD-COGNITION-ORIENTATION

\* learner-page schema alignment

\* cognition salience fixes



The final schema authority correction appears to have had greater impact than additional contract wording.



\---



\## 2. GAM exposition quality improved substantially



SP-01 connective exposition is clearly visible.



Materials now routinely:



\* explain concepts

\* establish causal relationships

\* connect ideas to inquiry questions

\* provide applied illustrations

\* support subsequent activity work



The earlier pattern of thin definitional prose appears substantially reduced.



Instructional materials now feel educational rather than informational.



\---



\## 3. Material preservation appears largely resolved



Compared with earlier benchmark runs:



\* worked examples survive

\* checklists survive

\* tables survive

\* scenarios survive

\* transfer activities survive



No major evidence of GAM body collapse was observed.



The preservation work completed during Sprint 49 appears effective.



\---



\## 4. Activity intelligibility improved



Activities are easier to understand as learner tasks.



Typical structure now resembles:



1\. Orientation

2\. Explanation

3\. Worked example

4\. Guided practice

5\. Verification

6\. Consolidation



rather than isolated content blocks.



Learners can more easily infer what they are expected to do.



\---



\# Remaining Issues



\## 5. Page JSON vs HTML fidelity requires investigation



Run 2 suggests a potential divergence:



\* page.html visibly renders cognition and framing structures

\* page.json activity rows may not consistently echo all upstream DLA framing fields



This requires investigation before any manifestation redesign.



Open question:



> Is renderer output relying on merge/repair behaviour rather than complete compose preservation?



Recommended Sprint 50 investigation.



\---



\## 6. Journey Compass currently manifests metadata more strongly than pedagogy



The Journey Compass is present and functional.



However, it currently behaves primarily as:



\* orientation metadata

\* session signposting

\* activity navigation



rather than:



\* metacognitive coaching

\* reasoning guidance

\* learner self-regulation support



The compass often restates information already visible elsewhere.



Potential future direction:



\* strengthen relationship between cognition fields and compass content

\* improve learner-facing reasoning guidance

\* reduce duplication



No implementation recommendation yet.



\---



\## 7. Cognition is present but not fully realised



The workflow now generates cognition structures.



The renderer now displays cognition structures.



However:



> Presence does not automatically create learner impact.



Current rendering often feels like:



\* preamble block

\* cognition block

\* task block

\* materials block



presented sequentially.



The learner experience does not yet fully integrate these elements into a coherent intellectual journey.



This is the central Sprint 50 challenge.



\---



\# Architectural Conclusions



\## Proven



\### Generation



\* DLA cognition generation works.

\* DLA framing generation works.

\* GAM exposition generation works.



\### Preservation



\* GAM preservation works.

\* DLA framing preservation largely works.

\* Design Page compose is substantially improved.



\### Rendering



\* Cognition structures are surfaced.

\* Preamble structures are surfaced.

\* Journey Compass is surfaced.



\---



\## Not Yet Proven



\### Compose fidelity



Need evidence that page.json fully reflects DLA framing fields.



\### Manifestation quality



Need evidence that learner-facing outputs communicate:



\* what to do

\* why it matters

\* how to think about it



clearly and consistently.



\### Compass effectiveness



Need evidence that the compass improves learner understanding rather than simply exposing metadata.



\---



\# Sprint 50 Implications



Sprint 49 focused on:



> Generation → Validation → Preservation



Sprint 50 should focus on:



> Manifestation → Salience → Learner Experience



The primary question is no longer:



> Where has the pedagogy gone?



The primary question is now:



> How can learners experience the pedagogy that is already present?



No further prompt architecture expansion is currently justified without new evidence.



\---



\# Recommended Starting Point for Sprint 50



1\. Audit DLA → page.json → page.html fidelity for Activity A1.

2\. Create a manifestation rubric.

3\. Review reading order and visual hierarchy.

4\. Evaluate Journey Compass usefulness.

5\. Investigate page.json / HTML divergence.

6\. Design evidence-led renderer improvements only after audit findings are documented.



\---



\*\*Overall assessment:\*\* Successful validation run.



The workflow now demonstrates end-to-end pedagogic generation and preservation. Remaining work is concentrated in manifestation, salience, and learner experience rather than generation architecture.



