<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import {needsPermissions} from "$lib/perms";
    import * as Accordion from "$lib/components/ui/accordion";

    let json_fmt = JSON.stringify({"id":"10000008","name_first":"Web","name_last":"Eight","name_full":"Web Eight","controller_rating_id":9,"controller_rating_short":"I2","controller_rating_long":"Senior Instructor","pilot_rating_id":7,"pilot_rating_short":"CMEL","pilot_rating_long":"Commercial Multi-Engine License","region_id":"EMEA","region_name":"Europe, Middle East and Africa","division_id":"MENA","division_name":"Middle East and North Africa","subdivision_id":null,"subdivision_name":null,"role":"01HGR7FB0YK0D6YMHF4VW7JNFG","vacc":null}, null, 2);

    needsPermissions(["system.log.view"]);
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Audit Log</h2>
    </div>

    <Accordion.Root class="w-full">
        <Accordion.Item value="item-someid">
            <Accordion.Trigger>
                <div class="space-x-5">
                    <span class="text-foreground/60">Mon Dec 04 2023 19:32:31Z</span>
                    <span class="font-medium text-primary">system acted on user:10000008</span>
                    <span class="text-primary">Created new user</span>
                </div>
            </Accordion.Trigger>
            <Accordion.Content>
                <div class="grid grid-cols-3 gap-5 h-min">
                    <div class="space-y-2">
                        <p class="font-semibold text-foreground/40">DETAILS</p>
                        <p><span class="font-medium">Log ID:</span> <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">01HGV52QS7PP1RT4PAX2AE8SFD</code></p>
                        <p><span class="font-medium">Timestamp:</span> <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">Mon Dec 04 2023 19:32:31 UTC</code></p>
                        <p><span class="font-medium">Actor:</span> <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">system</code></p>
                        <p><span class="font-medium">Item:</span> <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">user:10000008</code></p>
                        <p><span class="font-medium">Message:</span> <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">Created new user</code></p>
                    </div>
                    <div>
                        <p class="font-semibold text-foreground/40">BEFORE</p>
                        <div class="mt-2 relative rounded bg-muted p-[0.5rem] font-mono text-sm font-semibold mb-5 overflow-auto h-[150px]">
                            <pre>null</pre>
                        </div>
                    </div>
                    <div>
                        <p class="font-semibold text-foreground/40">AFTER</p>
                        <div class="mt-2 relative rounded bg-muted p-[0.5rem] font-mono text-sm font-semibold mb-5 overflow-auto h-[150px]">
                            <pre>{json_fmt}</pre>
                        </div>
                    </div>
                </div>
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
            <Accordion.Trigger>Is it styled?</Accordion.Trigger>
            <Accordion.Content>
                Yes. It comes with default styles that matches the other components'
                aesthetic.
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
            <Accordion.Trigger>Is it animated?</Accordion.Trigger>
            <Accordion.Content>
                Yes. It's animated by default, but you can disable it if you prefer.
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>
