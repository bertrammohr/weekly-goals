<script lang="ts">
	import { Tooltip, Alert, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Card, Select, Label } from 'flowbite-svelte';
	import { CheckCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';

	import type { PageData } from './$types';

	export let data: PageData;

	function hasCompletedOnDay(type: string, checkDay: number){
		if (type == "gym") {
			for (let i = 0; i < data.gym.length; i++) {
				if (new Date(data.gym[i].date).getDay() == checkDay) {
					return true;
				}
			}
		}
		if (type == "run") {
			for (let i = 0; i < data.run.length; i++) {
				if (new Date(data.run[i].date).getDay() == checkDay) {
					return true;
				}
			}
		}
		if (type == "core") {
			for (let i = 0; i < data.core.length; i++) {
				if (new Date(data.core[i].date).getDay() == checkDay) {
					return true;
				}
			}
		}
		if (type == "creatine") {
			for (let i = 0; i < data.creatine.length; i++) {
				if (new Date(data.creatine[i].date).getDay() == checkDay) {
					return true;
				}
			}
		}
		return false;
	}

	function getDay(day: number){
		switch (day) {
			case 0:
				return "Søndag";
			case 1:
				return "Mandag";
			case 2:
				return "Tirsdag";
			case 3:
				return "Onsdag";
			case 4:
				return "Torsdag";
			case 5:
				return "Fredag";
			case 6:
				return "Lørdag";
		}
	}

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

	const getDateString = (day: number) => {
		const newDate = new Date(data.monday);
		newDate.setDate(newDate.getDate() + day - 1 + (day == 0 ? 7 : 0));

		return `${newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()}/${newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1}`
	}

	const submit = (type: string, day: number) => {

		const newDate = new Date(data.monday);
		newDate.setDate(newDate.getDate() + day - 1 + (day == 0 ? 7 : 0));

		fetch('/api/addWeeklyGoal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ type, submitDate: newDate.toISOString().split('T')[0] })
		}).then(res=>res.json()).then(res=> {
			if (res.message == "success") {
				alertData.active = true;
				alertData.type = "success";
				alertData.message = "Mål tilføjet";
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

	const remove = (type: string, day: number) => {

		const newDate = new Date(data.monday);
		newDate.setDate(newDate.getDate() + day - 1 + (day == 0 ? 7 : 0));

		fetch('/api/removeWeeklyGoal', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ type, date: newDate.toISOString().split('T')[0] })
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

	const update = (type: string, day: number) => {
		if (hasCompletedOnDay(type, day)) {
			remove(type, day);
		} else {
			submit(type, day);
		}
	}
</script>

<svelte:head>
	<title>Weekly goals</title>
	<meta name="description" content="Weekly goals" />
</svelte:head>

{#if alertData.active}
	<Alert class="absolute w-full mx-auto text-right my-8" color={alertData.type == "success" ? "blue" : "red"}>
		<p class="mr-16">{alertData.message}</p>
	</Alert>
{/if}

<h1 class="text-2xl my-4 font-bold text-center text-white">Din træningsplan</h1>

<!-- <Card class="mx-auto my-8">
	<h1 class="text-xl font-bold text-center">Done?</h1>
	<Label>
		Mål
		<Select class="mt-2" items={weeklyGoalTypes} bind:value={selected} />
	</Label>
	<input class="my-2" type="date" bind:value={submitDate}>
	<Button class="my-2 w-1/2 mx-auto" on:click={submit}>Tilføj</Button>
</Card> -->

<div class="gap-4 my-4 flex flex-row w-1/5 mx-auto justify-center">
	<Button on:click={() => redirectWeek(false)}>&larr; Ugen forinden</Button>
	<p class="text-white text-center">{data.weekoffset}</p>
	<Button on:click={() => redirectWeek(true)}>Ugen efter &rarr;</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell class="text-center">Løb 2x</TableHeadCell>
		<TableHeadCell class="text-center">Gym 5x</TableHeadCell>
		<TableHeadCell class="text-center">Abs 3x</TableHeadCell>
		<TableHeadCell class="text-center">Creatine 7x</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each [1,2,3,4,5,6,0] as day}
			<TableBodyRow>
				<TableBodyCell class="text-center">{getDay(day)} (d. {getDateString(day)})</TableBodyCell>
				{#each ['run', 'gym', 'core', 'creatine'] as type}
					<TableBodyCell on:click={() => update(type, day)}>
						{#if hasCompletedOnDay(type, day)}
							<CheckCircleOutline id="icon-yes" class="mx-auto" size="lg" color="green"/>
							{:else}
							<CloseCircleOutline id="icon-no" class="mx-auto" size="lg" color="red"/>
						{/if}
					</TableBodyCell>
				{/each}
			</TableBodyRow>
		{/each}
		<TableBodyRow>
			<TableBodyCell class="text-center">Total</TableBodyCell>
			<TableBodyCell class="text-center">{data.run.length}</TableBodyCell>
			<TableBodyCell class="text-center">{data.gym.length}</TableBodyCell>
			<TableBodyCell class="text-center">{data.core.length}</TableBodyCell>
			<TableBodyCell class="text-center">{data.creatine.length}</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>
<Tooltip class="w-64 text-sm font-light" triggeredBy="#icon-yes">Click to remove</Tooltip>
<Tooltip class="w-64 text-sm font-light" triggeredBy="#icon-no">Click to add</Tooltip>