import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = () => {
  return {
    form: superValidate(formSchema),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, {
        form,
        ok: false,
        response: null,
      });
    }
    /*
        let res = await fetch(endpoint(`/vacc/edit?id=${event.params.id}`), {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.data.name,
                website: form.data.website,
                contact_email: form.data.contact_email
            })
        });

 */
    let res = {
      ok: false,
    };

    if (!res.ok) {
      return {
        form,
        ok: false,
        response: res,
      };
    } else {
      return {
        form,
        ok: true,
        response: null,
      };
    }
  },
};
