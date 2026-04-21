function App() {
	return `
		<main class="app">
			<h1>Hello World</h1>
			<p>This is your first app running from node_hello_world.</p>
		</main>
	`;
}

const root = document.getElementById('app');

if (root) {
	root.innerHTML = App();
}

export default App;