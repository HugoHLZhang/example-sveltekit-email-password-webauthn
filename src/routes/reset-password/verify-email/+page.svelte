<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData, PageData } from "./$types";

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<h1>Verify your email address</h1>
<p>We sent an 8-digit code to {data.email}.</p>
<form method="post" use:enhance>
	<label for="form-verify.code">Code</label>
	<input id="form-verify.code" name="code" required />
	<button>verify</button>
	<p>{form?.message ?? ""}</p>
</form>
