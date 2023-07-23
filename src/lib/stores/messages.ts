import { writable } from 'svelte/store'

export const messages = writable({ message: 'No message' })
