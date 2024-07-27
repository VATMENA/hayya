---
title: Training Plans
description: Understanding and using the new training plans system
tagline: "Applies to: Everyone"
---

<script>
import Callout from "$lib/components/Callout.svelte";
import Code from "$lib/docs/components/markdown/code.svelte";
import Steps from "$lib/docs/components/Steps.svelte";
</script>

With the release of the Training V2 system overhaul, Hayya is introducing a new system, the Training Plan system. Training plans intend to be a more consolidated and concise method of showing your facilities training tracks and to allow you to easily register for and begin requesting training along these tracks.

## Creating Training Plans

<Callout title="Permission required">
To create a training plan, you need the <Code>training.plans.manage</Code> permission.
</Callout>

<Steps>

### Prepare facility policy
Include a section in your facilities training policy outlining *in detail* all information a user may need to know about the training plan. It should include a general outline, as well as any specific limitations and outline exactly what is and is not included in each plan.
You must also include, in detail, a listing of all enrollment requirements that must be met.

### Access the training dashboard
Log into your facility HQ, and select Training from the navigation bar.

### View your facilities plans
Select the `Manage Training Plans` button under the `Training Plans` section.
If you do not see these sections, you may not have the required permissions. Contact your facilities leadership if you believe this is a mistake.

### Open new plan screen
Click the `Create` button in the top right of the screen.

### Enter plan details
First, enter the name of the training plan in the `Plan Name` field.
Enter the relevant facility policy (e.g. `Arabian Training Policy 2.1(c)(5)`) in the Relevant Facility Policy field.
Enter an *approximate* time from enrollment to completion of plan in the Estimated Time field.

For each item that your plan includes, click `Add` under `Includes` and enter it. Input similarly for the `Excludes`.

For example:

Includes:
- S1 Rating
- Unrestricted DEL, GND

Excludes:
- OMDB DEL, GND

Enter any additional details in the `Extra Details` field. Most commonly used to input information about airfields, e.g:
`Unrestricted ratings cover most airfields, including ABCD, XYZZ, OTHH`

Finally, if this plan may result in the student being limited by GCAP 6.1(a) adjacency restrictions, you must tick the `Has Adjacency Restriction?` switch. This is most commonly seen in the case of an unrestricted CTR covering a Tier 1 / Tier 2 APP/DEP facility.


Finally, click Create. The plan will become immediately available to all students in your facility.
Plans cannot currently be deleted. Please contact a member of the Hayya development team to request a plan be removed. Keep in mind that it may not be possible.

</Steps>

## Editing Training Plans

<Callout title="Permission required">
To edit a training plan, you need the <Code>training.plans.manage</Code> permission.
</Callout>