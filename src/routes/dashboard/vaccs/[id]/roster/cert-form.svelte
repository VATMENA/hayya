<script lang="ts">
  import { formSchema, type FormSchema } from "./schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import type { User } from "@prisma/client";
  import * as Form from "$lib/components/ui/form";
  import { C_TYP, P_TYP, POS } from "$lib/cert";
  import { can } from "$lib/perms/can";
  import { page } from "$app/stores";
  import Debug from "./debug.svelte";
  import DatePicker from "./DatePicker.svelte";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "$lib/components/ui/button";

  export let theForm: SuperValidated<FormSchema>;
  export let user: User;

  let c_typ_e = <any>C_TYP;
  let p_typ_e = <any>P_TYP;
  let pos_e = <any>POS;

  let has_solo_permission = can(
    $page.data.roles,
    $page.data.vacc_id,
    $page.data.user.vaccId,
    `division.training.issue_solo`,
  );
  let has_openskies_permission = can(
    $page.data.roles,
    $page.data.vacc_id,
    $page.data.user.vaccId,
    `division.training.issue_openskies`,
  );
  let has_perm_permission = can(
    $page.data.roles,
    $page.data.vacc_id,
    $page.data.user.vaccId,
    `vacc.${$page.data.vacc_id}.training.issue_certificate`,
  );

  let ctyp_req_perm = new Map();
  ctyp_req_perm.set(C_TYP.Solo as string, has_solo_permission);
  ctyp_req_perm.set(C_TYP.Permanent as string, has_perm_permission);

  let ptyp_req_perm = new Map();
  ptyp_req_perm.set(P_TYP.OpenSkies, has_openskies_permission);

  export let onsubmit;

  let options = {
    onSubmit: onsubmit,
  };
</script>

<Form.Root
  action="?/issue_certificate"
  method="POST"
  form={theForm}
  schema={formSchema}
  {options}
  let:config>
  <div class="grid grid-rows-2">
    <div class="grid grid-cols-2 gap-4">
      <Form.Item>
        <Form.Field {config} name="c_typ">
          <Form.Label>C/TYP</Form.Label>
          <Form.Select>
            <Form.SelectTrigger placeholder="Select C/TYP" />
            <Form.SelectContent>
              {#each Object.entries(c_typ_e) as [k, v]}
                <Form.SelectItem
                  disabled={ctyp_req_perm.has(v) ? ctyp_req_perm.get(v) : true}
                  value={v}>
                  {k}
                </Form.SelectItem>
              {/each}
            </Form.SelectContent>
          </Form.Select>
          <Form.Validation />
        </Form.Field>
      </Form.Item>
      <Form.Item>
        <Form.Field {config} name="p_typ">
          <Form.Label>P/TYP</Form.Label>
          <Form.Select>
            <Form.SelectTrigger placeholder="Select P/TYP" />
            <Form.SelectContent>
              {#each Object.entries(p_typ_e) as [k, v]}
                <Form.SelectItem
                  disabled={ptyp_req_perm.has(v) ? ptyp_req_perm.get(v) : true}
                  value={v}>
                  {k}
                </Form.SelectItem>
              {/each}
            </Form.SelectContent>
          </Form.Select>
          <Form.Validation />
        </Form.Field>
      </Form.Item>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <Form.Item>
        <Form.Field {config} name="facility">
          <Form.Label>Facility ICAO</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Field>
      </Form.Item>
      <Form.Item>
        <Form.Field {config} name="pos">
          <Form.Label>Position</Form.Label>
          <Form.Select>
            <Form.SelectTrigger placeholder="Select POS" />
            <Form.SelectContent>
              {#each Object.entries(pos_e) as [k, v]}
                <Form.SelectItem value={v}>{k}</Form.SelectItem>
              {/each}
            </Form.SelectContent>
          </Form.Select>
          <Form.Validation />
        </Form.Field>
      </Form.Item>
    </div>
  </div>
  <div>
    <Form.Field {config} name="comments">
      <Form.Item>
        <Form.Label>Comments</Form.Label>
        <Form.Textarea
          placeholder="Any additional comments or restrictions"
          class="resize-none" />
        <Form.Validation />
      </Form.Item>
    </Form.Field>
  </div>

  <input type="hidden" name="id" value={user.id} />

  <DatePicker {config} />

  <Form.Button class="w-full">Issue Certificate</Form.Button>
</Form.Root>

<!--
<div class="border rounded-md p-4 space-y-1">
  <h4 class="text-md font-semibold mb-2">New Certificate</h4>
  <Textarea class="resize-none" placeholder="Certificate comments" />
  <div class="flex items-center pt-2">
    <UserRound class="mr-2 h-4 w-4 opacity-70" />{" "}
    <span class="text-sm text-muted-foreground">
      Valid For: {user.name} in {$page.data.vacc_id}
    </span>
  </div>
  <div class="flex items-center pt-2">
    <Clock class="mr-2 h-4 w-4 opacity-70" />{" "}
    <span class="text-sm text-muted-foreground mr-2">Expires:</span>
    <Popover.Root>
      <Popover.Trigger asChild let:builder>
        <Button variant="outline" builders={[builder]}>
          <CalendarIcon class="mr-2 h-4 w-4" />
          {value ? df.format(value.toDate(getLocalTimeZone())) : "Never"}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <Calendar bind:value />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="flex items-center pt-2">
    <TowerControl class="mr-2 h-4 w-4 opacity-70" />{" "}
    <span class="text-sm text-muted-foreground mr-2">Position:</span>
    <div class="grid grid-cols-10 gap-2 w-full">
      <Select.Root>
        <Select.Trigger class="col-span-2">
          <Select.Value placeholder="F/TYP" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="SOLO" label="Solo">
              Solo
            </Select.Item>
            <Select.Item value="PERM" label="Permanent">
              Perm
            </Select.Item>
          </Select.Group>
        </Select.Content>
        <Select.Input name="favoriteFruit" />
      </Select.Root>

      <Select.Root>
        <Select.Trigger class="col-span-3">
          <Select.Value placeholder="C/TYP" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="AFU" label="Unrestricted">
              Unrestricted
            </Select.Item>
            <Select.Item value="AF1" label="Tier 1">
              Tier 1
            </Select.Item>
            <Select.Item value="AF2" label="Tier 2">
              Tier 2
            </Select.Item>
            <Select.Item value="CTR" label="Enroute">
              Enroute
            </Select.Item>
          </Select.Group>
        </Select.Content>
        <Select.Input name="favoriteFruit" />
      </Select.Root>

      <Input type="text" placeholder="ICAO" class="col-span-2" />

      <Select.Root>
        <Select.Trigger class="col-span-3">
          <Select.Value placeholder="P/TYP" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="DEL" label="Delivery">Delivery</Select.Item>
          </Select.Group>
          <Select.Group>
            <Select.Item value="GND" label="Ground">Ground</Select.Item>
          </Select.Group>
          <Select.Group>
            <Select.Item value="TWR" label="Tower">Tower</Select.Item>
          </Select.Group>
          <Select.Group>
            <Select.Item value="APP" label="APP/DEP">APP/DEP</Select.Item>
          </Select.Group>
        </Select.Content>
        <Select.Input name="favoriteFruit" />
      </Select.Root>
    </div>
  </div>
  <div class="flex items-center pt-2">
    <UserRound class="mr-2 h-4 w-4 opacity-70" />{" "}
    <span class="text-sm text-muted-foreground">
      Issued By: {$page.data.user.name}
    </span>
  </div>
</div>

<Button>Issue Certificate</Button>
-->
<!--
<Form.Root method="POST" schema={formSchema} let:config form={theForm}
           action="?/issue_certificate"
           class="space-y-2">
    <input name="id" type="hidden" readonly disabled value={user.id} />

    <div class="grid grid-rows-3 gap-4">
        <div class="grid grid-cols-2 gap-4 h-min pb-0">
            <Form.Field {config} name="facility_type">
                <Form.Item>
                    <Form.Label>Facility Type</Form.Label>
                    <Form.Select>
                        <Form.SelectTrigger placeholder="Select facility type" />
                        <Form.SelectContent>
                            <Form.SelectItem value="AFU">Unrestricted Terminal</Form.SelectItem>
                            <Form.SelectItem value="AF1">Tier 1 Terminal</Form.SelectItem>
                            <Form.SelectItem value="AF2">Tier 2 Terminal</Form.SelectItem>
                            <Form.SelectItem value="CTR">Enroute/Center Control</Form.SelectItem>
                        </Form.SelectContent>
                    </Form.Select>
                    <Form.Description>This will determine what positions the user is allowed to control.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
            <Form.Field {config} name="facility">
                <Form.Item>
                    <Form.Label>Facility ICAO</Form.Label>
                    <Form.Input />
                    <Form.Description>Leave blank if issuing an Unrestricted or Center/enroute certificate.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <Form.Field {config} name="cert_type">
                <Form.Item>
                    <Form.Label>Certificate Type</Form.Label>
                    <Form.Select>
                        <Form.SelectTrigger placeholder="Select certificate type" />
                        <Form.SelectContent>
                            <Form.SelectItem value="PERM">Permanent Certificate</Form.SelectItem>
                            <Form.SelectItem value="SOLO">Solo/Temporary Certificate</Form.SelectItem>
                        </Form.SelectContent>
                    </Form.Select>
                    <Form.Description>Permanent certificates cannot be revoked, except by vACC senior staff. Solo certificates will be revoked automatically.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>

            <Form.Field {config} name="cert_type">
                <Form.Item>
                    <Form.Label>Position</Form.Label>
                    <Form.Select>
                        <Form.SelectTrigger />
                        <Form.SelectContent>
                            <Form.SelectItem value="DEL">Clearance Delivery</Form.SelectItem>
                            <Form.SelectItem value="GND">Ground Control</Form.SelectItem>
                            <Form.SelectItem value="TWR">ATCT/Tower Control</Form.SelectItem>
                            <Form.SelectItem value="APP">Approach/Departure Terminal Control</Form.SelectItem>
                        </Form.SelectContent>
                    </Form.Select>
                    <Form.Description>Leave blank if issuing a Center/enroute certificate.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <Form.Field {config} name="comments">
                <Form.Item>
                    <Form.Label>Comments</Form.Label>
                    <Form.Input />
                    <Form.Description>Any additional comments to attach to your notarization of this certificate.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
            <Form.Field {config} name="solo_expires">
                <Form.Item>
                    <Form.Label for="solo_expires">Solo Expiry Date</Form.Label>
                    <Popover.Root>
                        <Form.Control id="solo_expires" let:attrs>
                            <Popover.Trigger
                                    id="solo_expires"
                                    {...attrs}
                                    class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[240px] pl-3 justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
                            >
                                {value
                                    ? df.format(value.toDate(getLocalTimeZone()))
                                    : "Pick a date"}
                                <CalendarIcon class="ml-auto opacity-50 h-4 w-4" />
                            </Popover.Trigger>
                        </Form.Control>
                        <Popover.Content class="w-auto p-0" side="top">
                            <Calendar
                                    bind:value
                                    bind:placeholder
                                    minValue={today(getLocalTimeZone()).add({days: 7})}
                                    maxValue={today(getLocalTimeZone()).add({days: 90})}
                                    calendarLabel="Solo expiry date"
                                    initialFocus
                                    onValueChange={(v) => {
              if (v) {
                $formStore.solo_expires = v.toString();
              } else {
                $formStore.solo_expires = "";
              }
            }}
                            />
                        </Popover.Content>
                    </Popover.Root>
                    <Form.Description>Per GCAP 7.3(c), must be <b>at least 7 days</b> and <b>at most 90 days</b>. Leave blank if not issuing a solo certificate.</Form.Description>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
    </div>

    <Form.Button>Issue Certificate</Form.Button>
</Form.Root>
-->
