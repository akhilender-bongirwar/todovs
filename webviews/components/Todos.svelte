<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";
    import Icon from '@iconify/svelte';
    export let user: User;
    export let accessToken: string;
    let text = "";
    let todos: Array<{ content: string; completed: boolean; id: number }> = [];

    async function addTodo(t: string) {
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "POST",
            body: JSON.stringify({
                content: t,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const { todo } = await response.json();
        todos = [todo, ...todos];
    }

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "new-todo":
                    addTodo(message.value);
                    break;
            }
        });

        const response = await fetch(`${apiBaseUrl}/todo`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        todos = payload.todos;
    });
</script>

<style>
    .wholediv{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }
    .each-row{
        display: flex;
        justify-content: space-between;
    }
    .complete {
        text-decoration: line-through;
    }
    .delete-icon {
        top: 2px;
    }
</style>

<div>Hello👋 {user.name}</div>
<div></div>

<form
    on:submit|preventDefault={async () => {
        addTodo(text);
        text = '';
    }}>
    <input bind:value={text} />
</form>

<ul class="wholediv">
    {#each todos as todo (todo.id)}
        <li
            on:click={async () => {
                todo.completed = !todo.completed;
                const response = await fetch(`${apiBaseUrl}/todo`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: todo.id,
                    }),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(await response.json());
            }}>
            <div class="each-row">
            <span class:complete={todo.completed}>{todo.content}</span>
            <span class="delete-icon" on:click={async (e) => {
                e.stopPropagation();
                const response = await fetch(`${apiBaseUrl}/todo`,{
                    method:'DELETE',
                    body: JSON.stringify({
                        id: todo.id,
                    }),
                    headers:{
                        authorization:`Bearer ${accessToken}`,
                    },
                });
                console.log(await response.json());
                if (response.ok) {
                        todos = todos.filter(t => t.id !== todo.id);
                    }
            }}>
             <Icon icon="mdi:delete" color="red" width="30" height="20" />
            </span>
        </div>
        </li>
    {/each}
</ul>