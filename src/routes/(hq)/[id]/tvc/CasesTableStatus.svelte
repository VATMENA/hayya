<script lang="ts">
  export let caseState: string;
</script>

{#if caseState === "Pending"}
  Pending
{:else if caseState === "InReview"}
  In Review
{:else if caseState === "AdditionalInformationNeeded"}
  Info Needed
{:else if caseState === "Accepted"}
  Approved
{:else if caseState === "Rejected"}
  Rejected
{/if}
