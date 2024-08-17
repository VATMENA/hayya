<script lang="ts">
  export let avail: string;

  $: jd = JSON.parse(avail);
</script>

{#each jd as day}
  <p>
    <b>{day.date}:</b>
    {day.start.hour.toString().padStart(2, "0")}:{day.start.minute
      .toString()
      .padStart(2, "0")} -> {day.end.hour
      .toString()
      .padStart(2, "0")}:{day.end.minute.toString().padStart(2, "0")}
  </p>
{/each}
