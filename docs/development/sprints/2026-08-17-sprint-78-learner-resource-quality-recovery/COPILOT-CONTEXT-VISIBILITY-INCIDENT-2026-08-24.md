# \# Copilot Context Visibility Incident — 24 August 2026

# 

# \## Status

# 

# Observed and reproducible external-platform issue.

# 

# No PRISM code change is currently indicated.

# 

# \## Summary

# 

# During a fresh Lagrangian workflow run, Microsoft Copilot began behaving inconsistently when accessing artefacts that were visibly present earlier in the same conversation.

# 

# The issue was investigated because an Episode Plan generation initially produced malformed JSON and subsequent attempts produced Copilot errors such as:

# 

# > "I can't continue this chat."

# 

# and:

# 

# > "I can't chat about this. Let's try a different topic."

# 

# Copilot later claimed required upstream artefacts were missing, despite those artefacts being visibly present in the conversation.

# 

# A controlled test reproduced the underlying problem.

# 

# \## Controlled reproduction

# 

# A fresh Copilot conversation was started and the normal PRISM workflow was run.

# 

# After Step 3, Copilot was asked to list the workflow artefacts currently available to it.

# 

# It reported:

# 

# &#x20;   STEP 1: learning\_content

# &#x20;   STEP 2: knowledge\_model

# &#x20;   STEP 3: learning\_outcomes

# 

# Episode Plan was then generated successfully.

# 

# Immediately afterwards, Copilot was asked the same question and reported:

# 

# &#x20;   STEP 1: learning\_content

# &#x20;   STEP 2: knowledge\_model

# &#x20;   STEP 3: learning\_outcomes

# &#x20;   STEP 4: page

# 

# At this point all expected workflow history was model-visible.

# 

# DLA was then run, producing Step 5.

# 

# Immediately after DLA, the same context-visibility check was repeated.

# 

# Copilot now reported only:

# 

# &#x20;   STEP 1: learning\_content

# &#x20;   STEP 5: page

# 

# Steps 2, 3 and 4 remained visibly present in the Copilot conversation UI but were no longer available in the context supplied to the model.

# 

# \## Confirmation

# 

# Copilot was explicitly asked to confirm this state without speculating about its cause.

# 

# It confirmed that, for the current turn:

# 

# Present:

# 

# \- Step 1: `learning\_content`

# \- Step 5: `page`

# 

# Not present:

# 

# \- Step 2: `knowledge\_model`

# \- Step 3: `learning\_outcomes`

# \- Step 4: `page`

# 

# Copilot also acknowledged that the missing steps could remain visible in the user-facing transcript while being absent from its model-visible context.

# 

# \## Observed transition

# 

# &#x20;   Before DLA

# 

# &#x20;   Step 1  learning\_content   PRESENT

# &#x20;   Step 2  knowledge\_model    PRESENT

# &#x20;   Step 3  learning\_outcomes  PRESENT

# &#x20;   Step 4  page               PRESENT

# 

# &#x20;                   |

# &#x20;                   | DLA generation

# &#x20;                   v

# 

# &#x20;   After DLA

# 

# &#x20;   Step 1  learning\_content   PRESENT

# &#x20;   Step 2  knowledge\_model    MISSING

# &#x20;   Step 3  learning\_outcomes  MISSING

# &#x20;   Step 4  page               MISSING

# &#x20;   Step 5  page               PRESENT

# 

# This occurred in a fresh conversation after only a small number of workflow steps.

# 

# The oldest workflow artefact (Step 1) and newest artefact (Step 5) remained available while the intervening Steps 2–4 disappeared.

# 

# This does not resemble straightforward oldest-first context-window truncation.

# 

# \## Earlier symptoms

# 

# Earlier attempts on the same morning showed related anomalous behaviour:

# 

# 1\. Episode Plan produced malformed JSON which PRISM correctly rejected as an invalid capture object.

# 2\. Attempts to rerun EP resulted in Copilot refusing to continue the conversation.

# 3\. In other fresh conversations, Copilot reported that required workflow artefacts such as `learning\_outcomes` or `knowledge\_model` were not available despite being visibly present in the conversation.

# 

# It is not established that the malformed EP output had the same cause. It should therefore remain a separate observation unless further evidence connects it to the context-visibility failure.

# 

# \## Current assessment

# 

# The evidence strongly indicates an intermittent Copilot conversation-context visibility or context-assembly problem.

# 

# There is currently no evidence that:

# 

# \- the PRISM workflow prompts have recently changed;

# \- PRISM is deleting the missing conversation turns;

# \- ordinary context-window exhaustion explains the behaviour;

# \- JSON formatting is responsible for the missing artefacts.

# 

# The exact Microsoft-side mechanism is unknown.

# 

# \## Consequence for testing

# 

# The affected Lagrangian run should not be used as evidence when diagnosing downstream PRISM generation behaviour.

# 

# Once context loss has been observed, subsequent generations cannot safely be assumed to have received their required upstream authority.

# 

# Existing completed runs, such as the Hydrology run, should be preferred for current conformance investigation.

# 

# \## Forensic lesson

# 

# When apparently irrational generation behaviour is encountered, verify that the generating model can still see the upstream workflow artefacts expected to be available in conversation context.

# 

# A useful diagnostic prompt is:

# 

# > Without reproducing their contents, list the STEP outputs currently available to you in this conversation, by step number and artefact name only.

# 

# This can distinguish a PRISM generation defect from loss of model-visible conversation context.

# 

# \## Action

# 

# No PRISM implementation change should be made solely in response to this incident.

# 

# Retain this note as evidence and investigate further only if:

# 

# \- the issue persists;

# \- it can be correlated with particular workflow behaviour; or

# \- evidence emerges that PRISM itself is responsible for constructing incomplete model context.

Subsequent fresh run showed a different selective-loss pattern: model-visible context contained Steps 1, 2, 5 and 6 while Steps 3 and 4 were absent. The same run's saved EP contained activities A1–A5, while the generated DLA contained only A1–A4. Causation between context loss and the missing DLA activity is not established, but outputs from affected runs must be treated as unreliable.

