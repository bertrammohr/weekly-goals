<script lang="ts">
	import { Tooltip, Modal, Alert, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { CheckCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { getDayStringFromNumber, getDateStringFromWeekday } from '$lib/util';
	import { user } from '$lib/stores/user';
	import type { PageData } from './$types';

	let loginModal = false;
	let loginModalInput = '';

	const attemptLogin = async () => {
		fetch('/api/validatePassword', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: loginModalInput })
		}).then(res=>res.json()).then(res=> {

			if (res.message == "success") {
				alertData.active = true;
				alertData.type = "success";
				alertData.message = "Logget ind";
				
				user.set({key: loginModalInput});
			} else if (res.message == "wrong password") {
				alertData.active = true;
				alertData.type = "error";
				alertData.message = "Forkert kode";
			} else {
				alertData.active = true;
				alertData.type = "error";
				alertData.message = "Der skete en fejl";
			}

			loginModalInput = '';

			setTimeout(() => {
				alertData.active = false;
			}, 3000);
		})
	};
	const redirectWeek = (forward: boolean) => {
		const urlParams = new URLSearchParams(window.location.search);
		let weekOffset = urlParams.has('week') ? Number(urlParams.get('week')) : 0;
		if (weekOffset == null) { weekOffset = 0 };

		if (forward) {
			weekOffset++;
		} else {
			weekOffset--;
		}
		
		window.location.href = `/?week=${weekOffset}`;
	};
	const alertData = {
		active: false,
		type: 'success',
		message: 'Mål tilføjet'
	}

	function getGoalIdIfHasCompletedOnDay (type: string, checkDay: number): string | null {
		return (data.workouts.find(workout => {
			const workoutDate = new Date(workout.date);
			return workout.type == type && workoutDate.getDay() == checkDay;
		}))?.id;
	}

	const submit = (type: string, day: number) => {

		const newDate = new Date(data.monday);
		newDate.setDate(newDate.getDate() + day - 1 + (day == 0 ? 7 : 0));

		return new Promise<string>((resolve, reject) => {
			fetch('/api/addWeeklyGoal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$user?.key}`
				},
				body: JSON.stringify({ type, submitDate: newDate.toISOString().split('T')[0] })
			}).then(res=>res.json()).then(res=> {
				if (res.message == "success") {
					resolve(res.id);
					alertData.active = true;
					alertData.type = "success";
					alertData.message = "Mål tilføjet";
				} else {
					reject();
					alertData.active = true;
					alertData.type = "error";
					alertData.message = "Der skete en fejl";
				}

				setTimeout(() => {
					alertData.active = false;
				}, 3000);
			})
		})
	}

	const remove = (id: string) => {
		fetch('/api/removeWeeklyGoal', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${$user?.key}`
			},
			body: JSON.stringify({ id })
		}).then(res=>res.json()).then(res=> {
			if (res.message == "success") {
				alertData.active = true;
				alertData.type = "success";
				alertData.message = "Mål fjernet";
			} else {
				alertData.active = true;
				alertData.type = "error";
				alertData.message = "Der skete en fejl";
			}

			setTimeout(() => {
				alertData.active = false;
			}, 3000);
		})
	}

	const update = async (type: string, day: number, index: number) => {
		console.log("updating", type, day);

		if (!$user) {
			alertData.active = true;
			alertData.type = "error";
			alertData.message = "Du skal være logget ind for at tilføje mål";
			setTimeout(() => {
				alertData.active = false;
			}, 3000);
			return;
		}

		if (sortedWorkoutData[day][index] != null) {
			remove(sortedWorkoutData[day][index] as string);
			sortedWorkoutData[day][index] = null;
		} else {
			sortedWorkoutData[day][index] = await submit(type, day);
		}
	}

	$: sortedWorkoutData = Array.from(Array(7), () => []).map((_, day) => {
		return ['run', 'gym', 'core', 'creatine'].map(type => {
			return getGoalIdIfHasCompletedOnDay(type, day);
		});
	});

	export let data: PageData;
</script>

<svelte:head>
	<title>Weekly goals</title>
	<meta name="description" content="Weekly goals" />
</svelte:head>

{#if alertData.active}
	<Alert class="fixed right-8 w-1/5 background-white mx-auto text-right my-8" color={alertData.type == "success" ? "blue" : "red"}>
		<p class="mr-16">{alertData.message}</p>
	</Alert>
{/if}

{#if !$user}
	<Button class="fixed right-8" on:click={() => (loginModal = true)}>Login</Button>
	<Modal title="Login" bind:open={loginModal} autoclose>
		<input type="password" placeholder="Password..." bind:value={loginModalInput}>
		<svelte:fragment slot="footer">
			<Button on:click={attemptLogin}>Login</Button>
			<Button color="alternative">Cancel</Button>
		</svelte:fragment>
	</Modal>
{/if}

<h1 class="text-2xl my-4 font-bold text-center text-white">Din træningsplan</h1>

<div class="gap-4 my-4 flex flex-row w-1/5 mx-auto justify-center">
	<Button on:click={() => redirectWeek(false)}>&larr; Ugen forinden</Button>
	<p class="text-white text-center">{data.weekoffset}</p>
	<Button on:click={() => redirectWeek(true)}>Ugen efter &rarr;</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell class="text-center">Løb<br>{data.workouts.filter(workout => workout.type == "run").length}/2</TableHeadCell>
		<TableHeadCell class="text-center">Gym<br>{data.workouts.filter(workout => workout.type == "gym").length}/5</TableHeadCell>
		<TableHeadCell class="text-center">Abs<br>{data.workouts.filter(workout => workout.type == "core").length}/3</TableHeadCell>
		<TableHeadCell class="text-center">Creatine<br>{data.workouts.filter(workout => workout.type == "creatine").length}/7</TableHeadCell>
	</TableHead>

	<TableBody>
		{#each [1,2,3,4,5,6,0] as day}
			<TableBodyRow>
				<TableBodyCell class="text-center">{getDayStringFromNumber(day)} (d. {getDateStringFromWeekday(data.monday, day)})</TableBodyCell>

				{#each sortedWorkoutData[day] as workout, i}
					<TableBodyCell on:click={() => update(['run', 'gym', 'core', 'creatine'][i], day, i)}>
						{#if workout}
							<CheckCircleOutline id="icon-yes" class="mx-auto" size="lg" color="green"/>
						{:else}
							<CloseCircleOutline id="icon-no" class="mx-auto" size="lg" color="red"/>
						{/if}
					</TableBodyCell>
				{/each}

			</TableBodyRow>
		{/each}

		<TableBodyRow>
			<TableBodyCell class="text-center">Streak</TableBodyCell>
			<TableBodyCell class="text-center"></TableBodyCell>
			<TableBodyCell class="text-center"></TableBodyCell>
			<TableBodyCell class="text-center"></TableBodyCell>
			<TableBodyCell class="text-center"></TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>
<Tooltip class="w-64 text-sm font-light" triggeredBy="#icon-yes">Click to remove</Tooltip>
<Tooltip class="w-64 text-sm font-light" triggeredBy="#icon-no">Click to add</Tooltip>