import { writable, type Writable } from 'svelte/store';
import type { User } from '$lib/scheme';
import { browser } from '$app/environment';

let storedUser;
if (browser) {
    storedUser = localStorage.getItem('user');
}

export const user: Writable<User | null> = storedUser ? writable(JSON.parse(storedUser)) : writable(null);

user.subscribe((value) => {
    if (!browser) return;

    localStorage.setItem('user', JSON.stringify(value));
});