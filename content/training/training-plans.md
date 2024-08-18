---
title: Training Plans
description: Understanding and using the new training plans system
tagline: "Applies to: Students, Mentors, Facility Staff"
---

<script>
import Callout from "$lib/components/Callout.svelte";
import Code from "$lib/docs/components/markdown/code.svelte";
import Steps from "$lib/docs/components/Steps.svelte";
</script>

With the release of the Training V2 system overhaul, Hayya is introducing a new system, the Training Plan system. Training plans intend to be a more consolidated and concise method of showing your facilities training tracks and to allow you to easily register for and begin requesting training along these tracks.

## Joining Training Plans
*This section continues the Get Training tutorial. You're on step 1!*

_Join Training Plan (you are here) - [(next) Create Training Request &rarr;](/docs/training/training-requests#create-a-request)_


<Callout title="Facility assignment required">
To join a training plan, you need to be a home or visiting member of a vACC that uses Hayya.
</Callout>

In order to start your training, you'll need to first enroll in the correct Training Plan.

<Steps>

### Access the training dashboard

Log into your facility HQ, and select Training from the navigation bar.

### Open the Join Plan menu

Under the message telling you that you're not enrolled in a training plan, click the `Enroll` button.

See a different message?

| Message                                                                   | Meaning                                                                                | Action                                                                                                |
|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| You're not currently enrolled in a training plan.                         | You need to join a plan first.                                                         | Continue with these instructions                                                                      |
| You currently have an outstanding request to join the [ Plan Name ] plan. | Your join was recieved, but a staff member needs to approve it before you're enrolled. | Wait for staff to approve your request, OR click Cancel Request if you want to join a different plan. |
| You're currently enrolled in the [ Plan Name ] plan.                      | You are already enrolled in a plan.                                                    | Request your training OR click Leave Plan to select a different plan.                                 |

### Select the best plan

You'll see an overview of the plans your facility offers. Choose the one that best suits you, and read over the relevant policy.
Seem like the right choice? Press `Select This Plan`.

### Confirm enrollment request

Make sure to read the warning that Hayya displays. It contains important information.
Once you have read and understand it, confirm your enrollment by pressing the confirmation button.

Your status should now update to `You currently have an outstanding request to join the [ Plan Name ] plan.`, which indicates that your request has joined the queue for staff approval.

### Wait for approval

Check back occasionally (no more than once a day) to wait for a decision on your enrollment.
You'll see one of three messages:

| Message                                                                   | Meaning                             | Action                                                                                                                                               |
|---------------------------------------------------------------------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| You currently have an outstanding request to join the [ Plan Name ] plan. | Your request is yet to be reviewed. | Keep waiting and check back often.                                                                                                                   |
| You're currently enrolled in the [ Plan Name ] plan.                      | Your request was approved.          | Read on to start requesting training!                                                                                                                |
| You're not currently enrolled in a training plan.                         | Your request was denied.            | You should have recieved some communication from a staff member about the reason for your rejection. Resolve any issues and make a new join request. |

All join requests must be manually approved by staff members. This should not take long - 5-10 days is the average, but keep in mind that staff are human and there may be delays. Contact your facility staff via your facilities support mechanism if you do not receive an approval or rejection decision within 14 days.

### Start requesting training

Read [Training Requests - Create a Request](/docs/training/training-requests#create-a-request) to learn how to request training once you've enrolled in a plan.

</Steps>

## Creating Training Plans

<Callout title="Permission required">
To create a training plan, you need the <Code>training.plans.manage</Code> permission.
</Callout>

<Steps>

### Prepare facility policy

Include a section in your facilities training policy outlining _in detail_ all information a user may need to know about the training plan. It should include a general outline, as well as any specific limitations and outline exactly what is and is not included in each plan.
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
Enter an _approximate_ time from enrollment to completion of plan in the Estimated Time field.

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
To create a training plan, you need the <Code>training.plans.manage</Code> permission.
</Callout>

<Steps>

### Update facility policy

Before updating the plan in Hayya, make sure to update the section in your facilities training policy outlining _in detail_ all information a user may need to know about the training plan. It should include a general outline, as well as any specific limitations and outline exactly what is and is not included in each plan.
You must also include, in detail, a listing of all enrollment requirements that must be met.

### Access the training dashboard

Log into your facility HQ, and select Training from the navigation bar.

### View your facilities plans

Select the `Manage Training Plans` button under the `Training Plans` section.
If you do not see these sections, you may not have the required permissions. Contact your facilities leadership if you believe this is a mistake.

### Open edit plan screen

Click the `Edit` button on the bottom of the plan you would like to edit.

### Enter plan details

First, enter the name of the training plan in the `Plan Name` field.
Enter the relevant facility policy (e.g. `Arabian Training Policy 2.1(c)(5)`) in the Relevant Facility Policy field.
Enter an _approximate_ time from enrollment to completion of plan in the Estimated Time field.

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

## Managing join requests

As detailed above, students cannot join plans alone. They must first submit a `Plan Join Request` which must be manually approved by facility staff before they are officially enrolled.

<Callout title="Permission required">
To manage join requests, you need the <Code>training.plans.requests.manage</Code> permission.
</Callout>

<Steps>

### Access the training dashboard

Log into your facility HQ, and select Training from the navigation bar.

### View outstanding requests

Select the `Manage Plan Join Requests` button under the `Training Plans` section.
If you do not see these sections, you may not have the required permissions. Contact your facilities leadership if you believe this is a mistake.

You will be presented with a table of outstanding join requests. Each entry will show the student, the student's rating, the plan they wish to join, and an Accept and Reject button.

### Review a request

Based on the relevant requirements, make a decision on a user, and select the appropriate action, either Accept or Reject.

*Especially* with rejections, it is highly encouraged you reach out to the user to inform them of your action, as a courtesy, as Hayya itself does not currently notify them when action is taken on their account.

</Steps>