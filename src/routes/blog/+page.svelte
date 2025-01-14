<script lang="ts">
	import Head from '$lib/Head.svelte';
	import { humanDate } from '$lib/formatters';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { metadata, tags } = data;

	let query;
	let params;

	let meta = {
		canonical: 'https://timdeschryver.dev/blog',
		title: "Tim's Blog",
		description: `${metadata.length} notes, mainly about Angular and .NET`,
	};

	onMount(() => {
		params = new URLSearchParams(window.location.search);
		// fallback, sometimes `query` seems to be undefined
		query = $page.url.searchParams.get('q') || params.get('q') || '';
	});

	$: if (params) {
		if (query) {
			params.set('q', query);
			window.history.replaceState(window.history.state, '', `${location.pathname}?${params}`);
		} else {
			params.delete('q');
			window.history.replaceState(window.history.state, '', location.pathname);
		}
	}

	$: queryParts = (query || '').split(' ');

	let filteredPosts = [];
	$: if (query) {
		filteredPosts = metadata.filter((p) => {
			return queryParts.every(
				(q) => p.tags.some((t) => match(t, q)) || like(p.title, q) || like(p.description, q),
			);
		});
	} else {
		filteredPosts = metadata;
	}

	function tagClicked(tag) {
		if (queryParts.includes(tag)) {
			query = queryParts.filter((q) => q !== tag).join(' ');
		} else {
			query = query ? `${query.trim()} ${tag}` : tag;
		}
	}

	function like(text, value) {
		return text.match(new RegExp(value, 'i'));
	}

	function match(text, value) {
		return text.match(new RegExp(`^${value}$`, 'i'));
	}
</script>

<Head title="Blog - Tim Deschryver" details={false} />

<svelte:head>
	<link rel="canonical" href={meta.canonical} />

	<meta name="title" content={meta.title} />
	<meta name="description" content={meta.description} />

	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />

	<meta name="og:url" content={meta.canonical} />
	<meta name="og:title" content={meta.title} />
	<meta name="og:description" content={meta.description} />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="mt-normal">
	<input
		type="search"
		bind:value={query}
		placeholder="Search"
		autocomplete="off"
		aria-label="Search"
	/>
	{#each tags as tag}
		<button
			class={tag}
			class:active={queryParts.some((q) => match(q, tag))}
			on:click={() => tagClicked(tag)}
		>
			{tag}
		</button>
	{/each}
</div>

<ul>
	{#each filteredPosts as post}
		<li class={post.tags.join(' ')} >
			<article>
				<h2 style:--name="post-title-{post.slug}">
					<a href={`/blog/${post.slug}`} class="mark-hover" data-sveltekit-preload-data="hover" >
						{post.title}
					</a>
				</h2>
				<time datetime={humanDate(post.date)}>{humanDate(post.date)}</time>
				<div>{post.description}</div>
				<div>
					<a href={`/blog/${post.slug}`} class="mark-hover" data-sveltekit-preload-data="hover"
						>Read more</a
					>
					{#if post.tldr}
						| <a
							href={`/blog/${post.slug}?tldr=true`}
							class="mark-hover"
							data-sveltekit-preload-data="hover">Read TLDR</a
						>
					{/if}
				</div>
			</article>
		</li>
	{:else}Sorry, no posts matched your criteria...
	{/each}
</ul>

<style>
	button {
		color: var(--text-color-light);
		border: 1px solid transparent;
		transition: color 0.2s ease;
	}

	button:hover,
	button.active {
		color: var(--text-color);
		border-color: hsla(var(--accent-color), 0.8);
	}

	button.active {
		background-color: hsla(var(--accent-color), 0.1);
		border-color: hsla(var(--accent-color), 0.8);
	}

	li {
		list-style: none;
		padding: 1em;
		transition: all 0.2s ease;
		border: 1px solid;
		border-left-width: 8px;
		border-radius: 3px;
		border-color: hsla(var(--accent-color), 0.2);
	}

	li:hover {
		transform: scale(1.05);
		background-color: hsla(var(--accent-color), 0.1);
		border-color: hsla(var(--accent-color), 0.8);
		border-left-width: 16px;
	}

	li + li {
		margin-top: var(--spacing);
	}

	li div {
		margin-top: var(--spacing-small);
		color: var(--text-color-light);
	}

	time {
		color: var(--text-color-light);
	}

	@media (prefers-reduced-motion: no-preference) {
		h2 {
			view-transition-name: var(--name);
		}
	}
</style>
